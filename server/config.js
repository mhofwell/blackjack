const REDIS_HOST = process.env.REDIS_HOST 
const REDIS_PORT = process.env.REDIS_PORT 
const REDIS_USER = process.env.REDIS_USER || '';
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';
const CLIENT_PORT = process.env.CLIENT_PORT || 3000;
const NODE_PORT = process.env.NODE_PORT || 8080 || 8090;

process.env.DATABASE_URL =
    process.env.DATABASE_URL_PROD || process.env.DATABASE_URL_DEV;

export {
    REDIS_HOST,
    REDIS_PORT,
    CLIENT_PORT,
    NODE_PORT,
    REDIS_USER,
    REDIS_PASSWORD,
};
