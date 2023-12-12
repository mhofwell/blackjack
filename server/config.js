let PORT,
    REDIS_HOST,
    REDIS_PORT,
    CLIENT_PORT,
    REDIS_USER,
    REDIS_PASSWORD,
    CLIENT_PRIVATE_URL,
    MS_PRIVATE_URL,
    DB_PRIVATE_URL;

if (process.env.NODE_ENV === 'development') {
    REDIS_HOST = process.env.REDIS_HOST;
    REDIS_PORT = process.env.REDIS_PORT;
    REDIS_USER = process.env.REDIS_USER;
    REDIS_PASSWORD = process.env.REDIS_PASSWORD;
    CLIENT_PORT = process.env.CLIENT_PORT;
    CLIENT_PRIVATE_URL = process.env.CLIENT_PRIVATE_URL;
    MS_PRIVATE_URL = process.env.MS_PRIVATE_URL;
    DB_PRIVATE_URL = process.env.DB_PRIVATE_URL;
    PORT = process.env.PORT;
} else if (process.env.NODE_ENV === 'production') {
    PORT = process.env.PORT;
    REDIS_HOST = process.env.REDIS_HOST;
    REDIS_PORT = process.env.REDIS_PORT;
    REDIS_USER = process.env.REDIS_USER;
    REDIS_PASSWORD = process.env.REDIS_PASSWORD;
    CLIENT_PORT = process.env.CLIENT_PORT;
    CLIENT_PRIVATE_URL = `https://${process.env.CLIENT_PRIVATE_URL}`;
    MS_PRIVATE_URL = `https://${process.env.MS_PRIVATE_URL}`;
    DB_PRIVATE_URL = `${process.env.DB_PRIVATE_URL}`;
    PORT = process.env.PORT;
}

export {
    PORT,
    REDIS_HOST,
    REDIS_PORT,
    CLIENT_PORT,
    REDIS_USER,
    REDIS_PASSWORD,
    CLIENT_PRIVATE_URL,
    MS_PRIVATE_URL,
    DB_PRIVATE_URL,
};
