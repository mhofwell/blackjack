import sortByNetGoalsDsc from '../../utils/sort-net-goals.js';
import getLogger from '../../logging/logger.js';

const logger = getLogger('api');

const Mutation = {
    updateEntry: async (parent, { input }, { prisma, pubsub }) => {
        try {
            console.log(`Finding entry ${input.id} mutate.`);
            const entry = await prisma.entry.update({
                where: {
                    id: input.id,
                },
                data: input,
                include: {
                    players: true,
                },
            });

            pubsub.publish('ENTRY_UPDATED', { entryUpdated: entry });
            return entry;
        } catch (err) {
            console.error({ error: err }, 'Error during mutation.');
            // logger.trace({ error: err });
        }
    },
    updatePool: async (parent, { input }, { prisma, pubsub }) => {
        try {
            const inputId = input.id;
            // childLogger = logger.child({ inputId });
            console.log(`Finding entry ${inputId} to mutate.`);

            const entry = await prisma.entry.update({
                where: {
                    id: input.id,
                },
                data: input,
            });

            // Get and re-sort the pool
            console.log(`Fetching pool ${entry.poolId}.`);

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
            console.log('Sorting entries.');
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

            console.log('New standings stored.');
            // childLogger.debug(
            //     { sortedEntries: sortedEntries },
            //     'Sorted entries.'
            // );

            pool.entries = sortedEntries;

            pubsub.publish('POOL_UPDATED', { poolUpdated: pool });
            return pool;
        } catch (err) {
            console.error(
                { error: err },
                'Something went wrong during entry updating.'
            );
            // childLogger.trace({ error: err });
        }
    },
    updatePlayer: async (parent, { input }, { prisma, pubsub }) => {
        try {
            // const childLogger = logger.child(input.id);
            console.log(`Updating player ${input.id}`);
            const player = await prisma.player.update({
                where: {
                    id: input.id,
                },
                data: input,
            });
            console.log('Player updated.');
            // childLogger.debug({ player: player });
            return player;
        } catch (err) {
            console.error({ error: err }, 'Error updating player.');
            // childLogger.trace({ error: err });
        }
    },
};

export default Mutation;
