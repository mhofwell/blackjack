let HOST,
    REDIS_PORT,
    CRON_PORT,
    REDIS_USER,
    REDIS_PASSWORD,
    API_PUBLIC_URL,
    API_PRIVATE_URL;

if (process.env.NODE_ENV === 'development') {
    HOST = 'localhost';
    REDIS_HOST = 'localhost';
    REDIS_PORT = 6379;
    REDIS_USER = '';
    REDIS_PASSWORD = '';
    CRON_PORT = 9000;
    process.env.DATABASE_URL = process.env.DATABASE_URL_DEV;
    API_PUBLIC_URL =
        process.env.API_PUBLIC_URL ||
        `http://api-production-9332.up.railway.app/graphql`;
    API_URL = `http://${HOST}:8080/graphql`;
    REDIS_URL = '';
} else if (process.env.NODE_ENV === 'production') {
    HOST = process.env.HOST;
    CRON_PORT = process.env.PORT;
    REDIS_HOST = process.env.REDIS_HOST;
    REDIS_PORT = process.env.REDIS_PORT;
    REDIS_USER = process.env.REDIS_USER;
    REDIS_PASSWORD = process.env.REDIS_PASSWORD;
    API_URL = process.env.API_PRIVATE_URL;
    REDIS_URL = process.env.REDIS_URL;
}

module.exports = {
    HOST,
    REDIS_PORT,
    REDIS_USER,
    REDIS_PASSWORD,
    REDIS_HOST,
    REDIS_URL,
    API_PUBLIC_URL,
    API_PRIVATE_URL,
    CRON_PORT,
    API_URL,
};
