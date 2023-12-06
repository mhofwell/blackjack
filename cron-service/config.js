let HOST, REDIS_PORT, PORT, REDIS_USER, REDIS_HOST, REDIS_PASSWORD, REDIS_URL;

if (process.env.NODE_ENV === 'development') {
    PORT = 9000;
    HOST = 'localhost';
    API_PORT = 8080;
    API_URL = `http://${HOST}:8080/graphql`;
    REDIS_HOST = 'localhost';
    REDIS_PORT = 6379;
    REDIS_USER = '';
    REDIS_PASSWORD = '';
    REDIS_URL = 'NONE';
} else if (process.env.NODE_ENV === 'production') {
    PORT = process.env.PORT;
    HOST = process.env.HOST;
    API_PORT = process.env.API_PORT;
    API_URL = `http://${process.env.API_PRIVATE_URL}:${API_PORT}/graphql`;
    REDIS_HOST = process.env.REDIS_HOST;
    REDIS_PORT = process.env.REDIS_PORT;
    REDIS_USER = process.env.REDIS_USER;
    REDIS_PASSWORD = process.env.REDIS_PASSWORD;
    REDIS_URL = process.env.REDIS_URL;
}

module.exports = {
    PORT,
    HOST,
    API_PORT,
    API_URL,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_USER,
    REDIS_PASSWORD,
    REDIS_URL,
};
