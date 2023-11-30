import redis from 'redis';
import 'dotenv/config';
import { REDIS_HOST, REDIS_PORT } from '../../config.js';

const client = redis.createClient({
    socket: {
        port: REDIS_PORT,
        host: REDIS_HOST,
    },
});

export default client;
