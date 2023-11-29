import client from './redis/client.js';
import { PrismaClient } from '@prisma/client';
import getLogger from '../logging/logger.js';

const logger = getLogger('express');

const pingEpl = async () => {
    try {
        const res = await fetch(
            'https://fantasy.premierleague.com/api/bootstrap-static'
        );
        const data = await res.json();
        const payload = {
            data: data,
            status: res.status,
        };
        return payload;
    } catch (err) {
        console.error(err);
    }
};

// const pingPrisma = async () => {
//     const prisma = new PrismaClient();
//     try {
//         const data = await prisma.players.findFirst();
//         if (data) {
//             return data;
//         }
//     } catch (err) {
//         console.error(err);
//     }
// };

const pingRedis = async () => {
    try {
        await client.connect();
        const res = await client.ping();
        logger.info(`Redis connected! ${res}`);
    } catch (err) {
        logger.error({ error: err }, 'Redis failed to connect.');
    }
    client.quit();
};

export { pingEpl, pingRedis };
