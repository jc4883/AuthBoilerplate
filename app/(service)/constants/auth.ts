export const AUTH_REDIRECT_SUCCESS_URL = '/dashboard';
export const AUTH_REDIRECT_FAILURE_URL = '/';

const authPrivateKey = process.env.AUTH_PRIVATE_KEY;
if (authPrivateKey == null) {
  throw new Error(`Expected in env <AUTH_PRIVATE_KEY>`);
}
export const AUTH_PRIVATE_KEY: string = authPrivateKey;
