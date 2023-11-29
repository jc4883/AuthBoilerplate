export enum NodeEnv {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

const PotentialNodeEnv = process.env.NODE_ENV as undefined | NodeEnv;
if (PotentialNodeEnv == null) {
  throw new Error(`Expected in env <NODE_ENV>`);
}

export const NODE_ENV = PotentialNodeEnv;
export const IS_LOCAL_PROXY = Boolean(process.env.LOCAL_PROXY);
