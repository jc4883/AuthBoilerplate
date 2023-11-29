import moment from 'moment';
import * as AuthConstants from '@/app/(service)/constants/auth';
import * as FacebookClient from '@/app/(service)/clients/facebook';
import * as Models from '@/app/(service)/models';
import * as Utils from '@/app/(service)/util';
import { IS_LOCAL_PROXY } from '@/app/(service)/constants/nodeEnv';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { db } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import { AppCookie } from '@/app/(service)/constants/appCookie';

interface DeleteAndInsertAccessTokenArgs {
  userId: string;
  accessToken: string;
  expireAt: Date;
}
const deleteAndInsertAccessToken = async (args: DeleteAndInsertAccessTokenArgs) => {
  const dbClient = await db.connect();
  await dbClient.sql<Models.AccessTokenIface>`DELETE FROM access_tokens WHERE user_id = ${args.userId};`;
  await dbClient.sql<Models.AccessTokenIface>`
    INSERT INTO access_tokens (
      issued_at,
      user_id,
      token,
      expire_at
    ) VALUES (
      NOW(),
      ${args.userId},
      crypt(${args.accessToken}, gen_salt('bf')),
      ${args.expireAt.toISOString()}
    )
    RETURNING *;`;
};

interface DeleteAndInsertFacebookAccessTokenArgs {
  appId: string;
  type: string;
  application: string;
  expireAt: Date;
  issuedAt: Date;
  scopes: string[];
  userId: string;
  facebookUserId: string;
  token: string;
}
const deleteAndInsertFacebookAccessToken = async (args: DeleteAndInsertFacebookAccessTokenArgs) => {
  const dbClient = await db.connect();
  await dbClient.sql`DELETE FROM facebook_access_tokens WHERE user_id = ${args.userId}`;
  await dbClient.sql`
    INSERT INTO facebook_access_tokens (
      app_id,
      type,
      application,
      expire_at,
      issued_at,
      scopes,
      user_id,
      facebook_user_id,
      token
    ) VALUES (
      ${args.appId},
      ${args.type},
      ${args.application},
      ${args.expireAt.toISOString()},
      ${args.issuedAt.toISOString()},
      ${Utils.Db.textArray(args.scopes)},
      ${args.userId},
      ${args.facebookUserId},
      ${args.token}
    )`;
};

enum ErrorCode {
  UnexpectedError,
}

interface RegisterArgs {
  facebookUserId: string;
  facebookEmail: string;
  facebookName: string;
}

interface RegisterResponseData {
  userId: string;
  accessToken: string;
}

interface RegisterResponse {
  data: null | RegisterResponseData;
  errorCodes: ErrorCode[];
}

const register = async (args: RegisterArgs): Promise<RegisterResponse> => {
  try {
    const dbClient = await db.connect();
    const userResult = await dbClient.sql<Models.UserIface>`
      INSERT INTO users (
        facebook_email,
        facebook_name,
        facebook_user_id
      ) VALUES (
        ${args.facebookEmail},
        ${args.facebookName},
        ${args.facebookUserId}
      ) RETURNING *;`;
    const newUser = userResult.rows[0];

    return {
      data: {
        userId: newUser.id,
        accessToken: uuidv4(),
      },
      errorCodes: [],
    };
  } catch (error) {
    console.error('[api/auth/callback/facebook/register]', error);
    return {
      data: null,
      errorCodes: [ErrorCode.UnexpectedError],
    };
  }
};

interface PostBodyIface {
  accessToken: string;
}
export async function POST(request: Request) {
  let redirectRoute:
    | typeof AuthConstants.AUTH_REDIRECT_FAILURE_URL
    | typeof AuthConstants.AUTH_REDIRECT_SUCCESS_URL
    | undefined;

  try {
    const body: PostBodyIface = await request.json();
    const [
      { longLivedAccessToken: facebookBusinessAccessToken },
      { appToken: facebookAppAccessToken },
    ] = await Promise.all([
      FacebookClient.fetchLongLivedAccessToken({
        shortLivedAccessToken: body.accessToken,
      }),
      FacebookClient.fetchAppToken(),
    ]);
    const facebookTokenDebug = await FacebookClient.fetchTokenDebug({
      longLivedAccessToken: facebookBusinessAccessToken,
      appToken: facebookAppAccessToken,
    });

    const client = await db.connect();
    const usersRes =
      await client.sql<Models.UserIface>`SELECT * FROM users WHERE facebook_user_id = ${facebookTokenDebug.user_id}`;

    const existingUserMaybe = usersRes.rows[0];

    if (existingUserMaybe != null) {
      const existingUser = existingUserMaybe;
      const accessToken = uuidv4();
      await Promise.all([
        deleteAndInsertAccessToken({
          userId: existingUser.id,
          accessToken,
          // expire at the same time facebook access token does
          expireAt: new Date(facebookTokenDebug.expires_at * 1000),
        }),
        deleteAndInsertFacebookAccessToken({
          userId: existingUser.id,
          appId: facebookTokenDebug.app_id,
          type: facebookTokenDebug.type,
          application: facebookTokenDebug.application,
          expireAt: new Date(facebookTokenDebug.expires_at * 1000),
          issuedAt: new Date(facebookTokenDebug.issued_at * 1000),
          scopes: facebookTokenDebug.scopes,
          facebookUserId: facebookTokenDebug.user_id,
          token: facebookBusinessAccessToken,
        }),
      ]);
      cookies().set(AppCookie.UserId, existingUser.id, {
        // domain: Domain,
        maxAge: 100 * 365 * 86400 * 1000,
        secure: IS_LOCAL_PROXY ? false : true,
        sameSite: true,
      });
      cookies().set(AppCookie.UserAccessToken, accessToken, {
        // domain: Domain,
        maxAge: 100 * 365 * 86400 * 1000,
        secure: IS_LOCAL_PROXY ? false : true,
        httpOnly: true,
        sameSite: true,
      });
      redirectRoute = AuthConstants.AUTH_REDIRECT_SUCCESS_URL;
    } else {
      const user = await FacebookClient.fetchUserByAccessToken({
        accessToken: facebookBusinessAccessToken,
      });
      const response = await register({
        facebookUserId: user.id,
        facebookEmail: user.email,
        facebookName: user.name,
      });

      if (response.errorCodes.length > 0 || response.data == null) {
        throw new Error(`Register Error Codes: ${response.errorCodes.join(', ')}`);
      }

      await Promise.all([
        deleteAndInsertAccessToken({
          userId: response.data.userId,
          accessToken: response.data.accessToken,
          // expire at the same time facebook access token does
          expireAt: new Date(facebookTokenDebug.expires_at * 1000),
        }),
        deleteAndInsertFacebookAccessToken({
          userId: response.data.userId,
          appId: facebookTokenDebug.app_id,
          type: facebookTokenDebug.type,
          application: facebookTokenDebug.application,
          expireAt: new Date(facebookTokenDebug.expires_at * 1000),
          issuedAt: new Date(facebookTokenDebug.issued_at * 1000),
          scopes: facebookTokenDebug.scopes,
          facebookUserId: facebookTokenDebug.user_id,
          token: facebookBusinessAccessToken,
        }),
      ]);
      cookies().set(AppCookie.UserId, response.data.userId, {
        // domain: Domain,
        maxAge: 100 * 365 * 86400 * 1000,
        secure: IS_LOCAL_PROXY ? false : true,
        sameSite: true,
      });
      cookies().set(AppCookie.UserAccessToken, response.data.accessToken, {
        // domain: Domain,
        maxAge: 100 * 365 * 86400 * 1000,
        secure: IS_LOCAL_PROXY ? false : true,
        httpOnly: true,
        sameSite: true,
      });
      redirectRoute = AuthConstants.AUTH_REDIRECT_SUCCESS_URL;
    }
  } catch (e) {
    console.error('[api/auth/callback/facebook] Error', e);
    redirectRoute = AuthConstants.AUTH_REDIRECT_FAILURE_URL;
  }
  redirect(redirectRoute);
}
