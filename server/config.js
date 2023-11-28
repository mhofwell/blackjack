const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const CLIENT_PORT = process.env.CLIENT_PORT || 3000;
const NODE_PORT = process.env.NODE_PORT || 8080 || 8090;

process.env.DATABASE_URL =
    process.env.DATABASE_URL_PROD || process.env.DATABASE_URL_DEV;

export { REDIS_HOST, REDIS_PORT, CLIENT_PORT, NODE_PORT };
