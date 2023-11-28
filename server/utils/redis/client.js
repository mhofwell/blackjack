import redis from 'redis';
import 'dotenv/config';
import { REDIS_HOST, REDIS_PORT } from '../../config';

const client = redis.createClient(REDIS_PORT, REDIS_HOST);

export default client;
