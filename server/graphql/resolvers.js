import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resolvers = {
    Query: {
        // return a user
        user: async (parent, args, context) => {
            const { id } = args;
            const user = await prisma.user.findUnique({
                where: {
                    id: id,
                },
                include: {
                    entries: {
                        select: {
                            id: true,
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
        // return an entry for a specific user in a particular pool
        entry: async (parent, args, context) => {
            const { userId, poolId } = args;
            const entry = await prisma.entry.findUnique({
                where: {
                    userId_poolId: {
                        userId: userId,
                        poolId: poolId,
                    },
                },
                include: {
                    players: true,
                    pool: true,
                    user: true,
                },
            });
            return entry;
        },
        // return all entries across all pools
        entries: async () => {
            const entries = await prisma.entry.findMany({
                include: {
                    user: true,
                    players: true,
                    pool: true,
                },
            });
            return entries;
        },
        // return all pools with all entries, players, users
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
        // return a single pool with all entries, players, users
        pool: async (parent, args, context) => {
            const { id } = args;
            const pool = await prisma.pool.findUnique({
                where: {
                    id: id,
                },
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
            return pool;
        },
        players: async (parent, args, context) => {
            const players = await prisma.player.findMany();
            return players;
        },
        login: async (parent, args, context) => {
            const { pw, fn, ln } = args;
            const user = await prisma.user.findFirst({
                where: {
                    pw: pw,
                    fn: fn,
                    ln: ln,
                },
            });
            return user;
        },
    },
};

export default resolvers;
