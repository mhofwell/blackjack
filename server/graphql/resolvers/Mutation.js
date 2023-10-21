import sortByNetGoalsDsc from '../../utils/sort-net-goals.js';

const Mutation = {
    updateEntry: async (parent, { input }, { prisma, pubsub }) => {
        const entry = await prisma.entry.update({
            where: {
                id: input.id,
            },
            data: input,
            include: {
                players: true,
            },
        });
        // console.log('Entry:', entry);

        pubsub.publish('ENTRY_UPDATED', { entryUpdated: entry });
        return entry;
    },
    updatePool: async (parent, { input }, { prisma, pubsub }) => {
        const entry = await prisma.entry.update({
            where: {
                id: input.id,
            },
            data: input,
        });
        // console.log('GQL: Entry updated:', entry);

        // Get and re-sort the pool

        const pool = await prisma.pool.findUnique({
            where: {
                id: entry.poolId,
            },
            include: {
                owner: true,
                entries: true,
            },
        });

        const sortedEntries = pool.entries.sort(sortByNetGoalsDsc);
        // update the rank of each entry
        let i = 0;

        for (const entry of sortedEntries) {
            i = i + 1;
            const res = await prisma.entry.update({
                where: {
                    id: entry.id,
                },
                data: {
                    standing: i,
                },
                include: {
                    players: true,
                    user: true,
                },
            });
            sortedEntries[i - 1] = res;
            // console.log('GQL: Refreshed standings');
        }

        // console.log('GQL: New standings stored.');

        pool.entries = sortedEntries;

        pubsub.publish('POOL_UPDATED', { poolUpdated: pool });
        return pool;
    },
    updatePlayer: async (parent, { input }, { prisma, pubsub }) => {
        const player = await prisma.player.update({
            where: {
                id: input.id,
            },
            data: input,
        });
        return player;
    },
};

export default Mutation;
