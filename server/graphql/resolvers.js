import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resolvers = {
    Query: {
        entries: async () => {
            const entries = await prisma.entry.findMany({
                include: {
                    user: true,
                    players: true,
                },
            });
            return entries;
        },
        user: async (parent, args, context) => {
            const user = await prisma.user.findUnique({
                where: {
                    id: args.id,
                },
                include: {
                    entries: {
                        select: {
                            id: true,
                            league: true,
                            region: true, 
                            season: true,
                            players: true,
                            goals: true,
                            own_goals: true,
                            net_goals: true,
                            suit: true,
                            winner: true,
                            standing: true,
                            pool: true,
                        },
                    },
                },
            });
            return user;
        },
        pools: async () => {
            const pools = await prisma.pool.findMany({
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
