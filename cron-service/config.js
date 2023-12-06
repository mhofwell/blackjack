let HOST,
    REDIS_PORT,
    PORT,
    REDIS_USER,
    REDIS_HOST,
    REDIS_PASSWORD,
    API_PUBLIC_URL,
    API_PRIVATE_URL,
    REDIS_URL;

if (process.env.NODE_ENV === 'development') {
    PORT = 9000;
    HOST = 'localhost';
    REDIS_HOST = 'localhost';
    REDIS_PORT = 6379;
    REDIS_USER = '';
    REDIS_PASSWORD = '';
    REDIS_URL = 'NONE';
    API_URL = `http://${HOST}:8080/graphql`;
} else if (process.env.NODE_ENV === 'production') {
    PORT = process.env.PORT;
    HOST = process.env.HOST;
    REDIS_HOST = process.env.REDIS_HOST;
    REDIS_PORT = process.env.REDIS_PORT;
    REDIS_USER = process.env.REDIS_USER;
    REDIS_PASSWORD = process.env.REDIS_PASSWORD;
    REDIS_URL = process.env.REDIS_URL;
    API_URL = `http://${process.env.API_PRIVATE_URL}:5647/graphql`;
}

module.exports = {
    PORT,
    HOST,
    REDIS_USER,
    REDIS_PASSWORD,
    REDIS_HOST,
    REDIS_URL,
    API_PUBLIC_URL,
    API_PRIVATE_URL,
    CRON_PORT,
    API_URL,
};
