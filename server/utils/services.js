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
    await client.connect();
    const res = await client.ping();
    res === 'PONG'
        ? logger.info(`Redis connected! ${res}`)
        : logger.warn('Redis not connected.');
};

export { pingEpl, pingRedis };
