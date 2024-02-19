import prisma from './prisma/client.js';

const poolsToSort = await prisma.pool.findMany({
    include: {
        entries: {
            select: {
                id: true,
                goals: true,
                own_goals: true,
            },
        },
    },
});

console.log(poolsToSort);
