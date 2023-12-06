let PORT,
    REDIS_HOST,
    REDIS_PORT,
    CLIENT_PORT,
    REDIS_USER,
    REDIS_PASSWORD,
    API_LOCAL_URL = `http://localhost:${PORT}/graphql`;

if (process.env.NODE_ENV === 'development') {
    REDIS_HOST = 'localhost';
    REDIS_PORT = 6379;
    REDIS_USER = '';
    REDIS_PASSWORD = '';
    CLIENT_PORT = 3000;
    process.env.PORT = 8080;
    process.env.DATABASE_URL = process.env.LOCAL_DB || process.env.DATABASE_URL;
} else if (process.env.NODE_ENV === 'production') {
    PORT = process.env.PORT;
    REDIS_HOST = process.env.REDIS_HOST;
    REDIS_PORT = process.env.REDIS_PORT;
    REDIS_USER = process.env.REDIS_USER;
    REDIS_PASSWORD = process.env.REDIS_PASSWORD;
    CLIENT_PORT = process.env.CLIENT_PORT;
    process.env.DATABASE_URL = process.env.LOCAL_DB || process.env.DATABASE_URL;
}

export {
    PORT,
    REDIS_HOST,
    REDIS_PORT,
    CLIENT_PORT,
    REDIS_USER,
    REDIS_PASSWORD,
    API_LOCAL_URL,
};
