CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()
);