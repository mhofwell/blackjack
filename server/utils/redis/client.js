import redis from 'redis';
import 'dotenv/config';

let port = process.env.REDIS_PORT;
let host = process.env.REDIS_HOST;

const client = redis.createClient(port, host);

export default client;
