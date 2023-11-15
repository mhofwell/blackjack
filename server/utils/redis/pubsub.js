import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Redis } from 'ioredis';

const options = {
    host: 'redis-stack-server',
    port: 6379,
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
