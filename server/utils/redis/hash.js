import redisClient from "./client.js";

export async function hSet(id, obj) {
    try {
        await redisClient.connect();
        const data = await redisClient.hSet(id.toString(), obj);
        await redisClient.quit();
        return data;
    } catch (err) {
        console.error(err);
    }
}

export async function hGetAll(id) {
    try {
        await redisClient.connect();
        const data = await redisClient.hGetAll(id.toString());
        await redisClient.quit();
        return data;
    } catch (err) {
        console.log(err);
    }
}
