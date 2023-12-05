let HOST,
    REDIS_PORT,
    CRON_PORT,
    API_PORT,
    REDIS_USER,
    REDIS_PASSWORD,
    API_PUBLIC_URL,
    API_PRIVATE_URL;

if (process.env.NODE_ENV === 'development') {
    HOST = 'localhost';
    REDIS_PORT = 6379;
    REDIS_USER = '';
    REDIS_PASSWORD = '';
    CRON_PORT = 9000;
    process.env.DATABASE_URL = process.env.DATABASE_URL_DEV;
    API_PUBLIC_URL =
        process.env.API_PUBLIC_URL ||
        `http://api-production-9332.up.railway.app/graphql`;
    API_URL = `http://${HOST}:8080/graphql`;
} else if (process.env.NODE_ENV === 'production') {
    HOST = process.env.HOST;
    REDIS_PORT = process.env.REDIS_PORT;
    REDIS_USER = process.env.REDIS_USER;
    REDIS_PASSWORD = process.env.REDIS_PASSWORD;
    API_PORT = process.env.PORT;
    API_PUBLIC_URL = process.env.API_PUBLIC_URL;
    API_URL = process.env.API_PRIVATE_URL;
}

module.exports = {
    HOST,
    REDIS_PORT,
    API_PORT,
    REDIS_USER,
    REDIS_PASSWORD,
    API_PUBLIC_URL,
    API_PRIVATE_URL,
    CRON_PORT,
    API_URL,
};
