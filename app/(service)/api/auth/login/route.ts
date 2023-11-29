import * as AccessTokenClient from '@/app/(service)/clients/accessToken';
import * as AuthConstants from '@/app/(service)/constants/auth';
import * as FacebookConstants from '@/app/(service)/constants/facebook';
import { AppCookie } from '@/app/(service)/constants/appCookie';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const userIdCookie = cookies().get(AppCookie.UserId);
  const accessTokenCookie = cookies().get(AppCookie.UserAccessToken);

  const userId = userIdCookie?.value;
  const accessToken = accessTokenCookie?.value;

  if (accessToken == null || userId == null) {
    return Response.json({
      url: FacebookConstants.FACEBOOK_AUTHORIZATION_URI,
    });
  }

  try {
    const valid = await AccessTokenClient.check({
      userId,
      accessToken,
    });
    if (valid) {
      return Response.json({
        url: AuthConstants.AUTH_REDIRECT_SUCCESS_URL,
      });
    } else {
      throw new Error();
    }
  } catch (e) {
    cookies().delete(AppCookie.UserId);
    cookies().delete(AppCookie.UserAccessToken);
    return Response.json({
      url: FacebookConstants.FACEBOOK_AUTHORIZATION_URI,
    });
  }
}
