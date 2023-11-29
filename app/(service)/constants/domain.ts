import { IS_LOCAL_PROXY } from './nodeEnv';
export const Domain = IS_LOCAL_PROXY ? 'http://localhost:3000' : 'trynove.com';
