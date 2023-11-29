type CookieKeyType = 'UserId' | 'UserAccessToken';

// NOTE: SessionId and UserAccessToken combined make us the IdentitySessionToken.

export const AppCookie: {
  [key in CookieKeyType]: string;
} = {
  UserId: `x-n-u-id`,
  UserAccessToken: `x-n-u-token`,
};
