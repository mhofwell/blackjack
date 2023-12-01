let REDIS_HOST, REDIS_PORT, CLIENT_PORT, NODE_PORT, REDIS_USER, REDIS_PASSWORD, PUBLIC_URL, PRIVATE_URL;

if (process.env.NODE_ENV === 'development') {
    REDIS_HOST = 'localhost';
    REDIS_PORT = 6379;
    REDIS_USER = '';
    REDIS_PASSWORD = '';
    CLIENT_PORT = 3000;
    NODE_PORT = 8080;
    process.env.DATABASE_URL = process.env.DATABASE_URL_DEV;
    PUBLIC_URL = `localhost:${NODE_PORT}/graphql`;
    PRIVATE_URL = PUBLIC_URL;
} else if (process.env.NODE_ENV === 'production') {
    REDIS_HOST = process.env.REDIS_HOST;
    REDIS_PORT = process.env.REDIS_PORT;
    REDIS_USER = process.env.REDIS_USER;
    REDIS_PASSWORD = process.env.REDIS_PASSWORD;
    CLIENT_PORT = process.env.CLIENT_PORT;
    NODE_PORT = process.env.PORT;
    PUBLIC_URL = process.env.API_URL_PUBLIC;
    PRIVATE_URL = process.env.API_URL_PRIVATE;
}

export {
    REDIS_HOST,
    REDIS_PORT,
    CLIENT_PORT,
    NODE_PORT,
    REDIS_USER,
    REDIS_PASSWORD,
};
