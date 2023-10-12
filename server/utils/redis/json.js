import redisClient from './client.js';

export async function setRedisJSON(key, id, obj) {
    try {
        const KEY = `${key}:${id}`;
        await redisClient.connect();
        await redisClient.json.set(KEY, '.', obj);
        await redisClient.expire(KEY, 10);
        await redisClient.quit();
        return KEY;
    } catch (err) {
        console.error(err);
    }
}

export async function getRedisJSON(key, id) {
    try {
        await redisClient.connect();
        const KEY = `${key}:${id}`;
        const player = await redisClient.json.get(KEY, {
            path: '.',
        });
        await redisClient.quit();
        return player;
    } catch (err) {
        console.error(err);
    }
}