import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resolvers = {
    Query: {
        entries: () => {
            const entries = prisma.entry.findMany({
                include: {
                    user: true,
                    players: true,
                },
            });
            return entries;
        },
        pools: () => {
            const pools = prisma.pool.findMany({
                include: {
                    entries: {
                        include: {
                            players: true,
                            user: true,
                        },
                    },
                    owner: true,
                },
            });
            return pools;
        },
    },
};

export default resolvers;
