import { IS_LOCAL_PROXY } from './nodeEnv';

export const FACEBOOK_APP_ID = '359347213280848';
export const FACEBOOK_REDIRECT_URI = IS_LOCAL_PROXY
  ? 'http://localhost:3000/auth/callback/facebook'
  : 'https://trynove.com/auth/callback/facebook';
export const FACEBOOK_AUTHORIZATION_URI = `https://www.facebook.com/dialog/oauth?client_id=${FACEBOOK_APP_ID}&display=page&redirect_uri=${FACEBOOK_REDIRECT_URI}&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&response_type=token&scope=instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement,business_management`;
export const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
if (FACEBOOK_APP_SECRET == null) {
  throw new Error(`Expected in env <FACEBOOK_APP_SECRET>`);
}
