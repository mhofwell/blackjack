import redis from 'redis';
import 'dotenv/config';
import { REDIS_HOST, REDIS_PORT } from '../../config';

let client;

if ((process.env.NODE_ENV = 'production')) {
    client = redis.createClient({ url: process.env.REDIS_URL });
} else {
    client = redis.createClient(REDIS_PORT, REDIS_HOST);
}

export default client;
