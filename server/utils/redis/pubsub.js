import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Redis } from 'ioredis';

// Constants
import {
    // REDIS_USER,
    // REDIS_PASSWORD,
    REDIS_HOST,
    REDIS_PORT,
} from '../../config.js';

const options = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    // username: REDIS_USER,
    // password: REDIS_PASSWORD,
    retryStrategy: (times) => {
        // reconnect after
        return Math.min(times * 50, 2000);
    },
};

const pubsub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options),
});

export default pubsub;
