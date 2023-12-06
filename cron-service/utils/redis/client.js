const redis = require('redis');
// const { REDIS_HOST, REDIS_PORT} = require('../../config.js');
const { REDIS_URL } = require('../../config.js');

const client = redis.createClient({
    // socket: {
    //     port: REDIS_PORT,
    //     host: REDIS_HOST,
    // },
    REDIS_URL
});

module.exports = client;
