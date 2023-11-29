import redis from 'redis';
import 'dotenv/config';
import { REDIS_HOST, REDIS_PORT } from '../../config.js';

// const client = redis.createClient({ port: REDIS_PORT, host: REDIS_HOST });
const client = redis.createClient(6379, 'redis-stack-server.railway.internal');

export default client;
