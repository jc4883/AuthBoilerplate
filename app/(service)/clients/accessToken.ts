import crypto from 'crypto';
import { kv } from '@vercel/kv';
import { db } from '@vercel/postgres';
import * as Models from '@/app/(service)/models';
import * as AuthConstants from '@/app/(service)/constants/auth';

interface SignArgs {
  token: string;
}

export const sign = async (args: SignArgs): Promise<string> => {
  const signer = crypto.createSign('RSA-SHA512');
  signer.update(args.token);
  const signature = signer.sign(AuthConstants.AUTH_PRIVATE_KEY, 'base64');
  return encodeURIComponent(signature);
};

interface Args {
  accessToken: string;
  userId: string;
}

export const check = async (args: Args): Promise<boolean> => {
  const token = args.accessToken;
  const userId = args.userId;
  const dbClient = await db.connect();

  if (token != null && token !== '' && userId != null && userId !== '') {
    const signature = await sign({ token });
    const cachedOk = await kv.get(`user/${userId}/access/${signature}`);
    if (cachedOk === userId) {
      return true;
    } else {
      const [accessTokenResults] = await Promise.all([
        dbClient.sql`
          SELECT * FROM access_tokens 
          WHERE user_id = ${userId} AND 
          token = crypt(${token}, token) AND 
          expire_at > CURRENT_TIMESTAMP;`,
      ]);
      const accessToken = accessTokenResults.rows[0] as null | Models.AccessTokenIface;
      if (accessToken != null) {
        await kv.set(`user/${userId}/access/${signature}`, userId, { ex: 7 * 86400 });
        return true;
      }
    }
  }
  return false;
};
