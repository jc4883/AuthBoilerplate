import { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } from '@/app/(service)/constants/facebook';

interface FetchLongLivedAccessTokenArgsIface {
  shortLivedAccessToken: string;
}
interface FetchLongLivedAccessTokenResponseIface {
  longLivedAccessToken: string;
}
export const fetchLongLivedAccessToken = async (
  args: FetchLongLivedAccessTokenArgsIface,
): Promise<FetchLongLivedAccessTokenResponseIface> => {
  const longLivedAccessTokenRes = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&fb_exchange_token=${args.shortLivedAccessToken}`,
  );
  const longLivedAccessTokenJson = await longLivedAccessTokenRes.json();
  return { longLivedAccessToken: longLivedAccessTokenJson.access_token };
};

interface FetchAppTokenResponseIface {
  appToken: string;
}
export const fetchAppToken = async (): Promise<FetchAppTokenResponseIface> => {
  const appTokenRes = await fetch(
    `https://graph.facebook.com/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&grant_type=client_credentials`,
  );
  const appTokenJson = await appTokenRes.json();
  return { appToken: appTokenJson.access_token };
};

interface FetchTokenDebugArgsIface {
  longLivedAccessToken: string;
  appToken: string;
}
interface FetchTokenDebugResponseIface {
  app_id: string;
  type: string;
  application: string;
  data_access_expires_at: number;
  expires_at: number;
  is_valid: boolean;
  issued_at: number;
  scopes: string[];
  granular_scopes: any;
  user_id: string;
}
export const fetchTokenDebug = async (
  args: FetchTokenDebugArgsIface,
): Promise<FetchTokenDebugResponseIface> => {
  const debugTokenRes = await fetch(
    `https://graph.facebook.com/debug_token?input_token=${args.longLivedAccessToken}&access_token=${args.appToken}`,
  );
  const debugTokenJson: FetchTokenDebugResponseIface = (await debugTokenRes.json()).data;
  return debugTokenJson;
};

interface FetchUserArgsIface {
  accessToken: string;
}
interface FetchUserResponseIface {
  id: string;
  name: string;
  email: string;
}
export const fetchUserByAccessToken = async (
  args: FetchUserArgsIface,
): Promise<FetchUserResponseIface> => {
  const userRes = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email&access_token=${args.accessToken}`,
  );
  const userJson: FetchUserResponseIface = await userRes.json();
  return userJson;
};
