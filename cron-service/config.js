let HOST,
    REDIS_PORT,
    CRON_PORT,
    REDIS_USER,
    REDIS_HOST,
    REDIS_PASSWORD,
    API_PUBLIC_URL,
    API_PRIVATE_URL,
    REDIS_URL;

if (process.env.NODE_ENV === 'development') {
    HOST = 'localhost';
    CRON_PORT = 9000;
    REDIS_HOST = 'localhost';
    REDIS_PORT = 6379;
    REDIS_USER = '';
    REDIS_PASSWORD = '';
    REDIS_URL = 'NONE';
    API_URL = `http://${HOST}:8080/graphql`;
} else if (process.env.NODE_ENV === 'production') {
    HOST = process.env.HOST;
    CRON_PORT = process.env.PORT;
    REDIS_HOST = process.env.REDIS_HOST;
    REDIS_PORT = process.env.REDIS_PORT;
    REDIS_USER = process.env.REDIS_USER;
    REDIS_PASSWORD = process.env.REDIS_PASSWORD;
    REDIS_URL = process.env.REDIS_URL;
    API_URL = `railway://${process.env.API_PRIVATE_URL}/graphql`;
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
