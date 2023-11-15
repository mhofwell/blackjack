import redis from 'redis';
import 'dotenv/config';

// let port = process.env.REDIS_PORT;
// let host = process.env.REDIS_HOST;
let host = 'redis-stack-server';
let port = 6379

const client = redis.createClient(port, host);

export default client;
