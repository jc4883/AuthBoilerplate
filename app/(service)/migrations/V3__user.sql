ALTER TABLE facebook_access_tokens ADD COLUMN facebook_user_id TEXT NOT NULL;
ALTER TABLE users ADD COLUMN facebook_user_id TEXT NOT NULL;
ALTER TABLE users ADD COLUMN facebook_email TEXT NOT NULL;
ALTER TABLE users ADD COLUMN facebook_name TEXT NOT NULL;