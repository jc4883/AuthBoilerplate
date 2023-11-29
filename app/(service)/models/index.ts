export interface UserIface {
  id: string;
  facebook_email: string;
  facebook_name: string;
  facebook_user_id: string;
  created_at: Date;
}

export interface AccessTokenIface {
  id: string;
  expire_at: Date;
  user_id: string;
  token: string;
  issued_at: Date;
  user_agent: string | null;
  created_at: Date;
}

export interface FacebookAccessTokenIface {
  id: string;
  app_id: string;
  type: string;
  application: string;
  expire_at: Date;
  issued_at: Date;
  scopes: string[];
  user_id: string;
  facebook_user_id: string;
  token: string;
  created_at: Date;
}
