const redis = require('redis');
const { HOST, REDIS_PORT } = require('../../config.js');

const client = redis.createClient({
    socket: {
        port: REDIS_PORT,
        host: HOST,
    },
});

module.exports = client;
