const { RedisPubSub } = 'graphql-redis-subscriptions';
const { Redis } = 'ioredis';

const { HOST, REDIS_PORT } = require('../../config.js');

// Constants
import {
    // REDIS_USER,
    // REDIS_PASSWORD,
    HOST,
    REDIS_PORT,
} from '../../config.js';

const options = {
    host: HOST,
    port: REDIS_PORT,
    // username: REDIS_USER,
    // password: REDIS_PASSWORD,
    family: 0,
    retryStrategy: (times) => {
        // reconnect after
        return Math.min(times * 50, 2000);
    },
};

const pubsub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options),
});

module.exports = pubsub;
