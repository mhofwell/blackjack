import sortByNetGoalsDsc from '../../utils/sort-net-goals.js';
import getLogger from '../../logging/logger.js';
const logger = getLogger('api');

const Mutation = {
    updateEntry: async (_, { input }, { prisma, pubsub, req }) => {
        const kt = input.kickoffTime;
        try {
            logger.debug(
                { headers: req.headers, body: req.body },
                `gw-worker-${kt} > Update entry mutation request.`
            );
            logger.info(
                `gw-worker-${kt} > Finding entry ${input.id} to mutate.`
            );
            const entry = await prisma.entry.update({
                where: {
                    id: input.id,
                },
                data: {
                    goals: input.goals,
                    own_goals: input.own_goals,
                    net_goals: input.net_goals,
                },
                include: {
                    players: true,
                },
            });
            pubsub.publish('ENTRY_UPDATED', { entryUpdated: entry });
            logger.info(`gw-worker-${kt} > ENTRY_UPDATED published.`);
            return entry;
        } catch (err) {
            logger.warn(`Error during mutation of entry.`);
            logger.error(err);
        }
    },
    updateKickoffTimes: async (_, { input }, { prisma, pubsub, req }) => {
        try {
            logger.debug(
                { headers: req.rawHeaders, body: req.body },
                `gw-worker-kickoffTimes > Update fixtures mutation request.`
            );
            logger.info(
                `gw-worker-kickoffTimes > Updating fixtures for the next gameweek.`
            );

            const kickoffTimeCount = await prisma.kickoff.count();

            kickoffTimeCount > 0 ? await prisma.kickoff.deleteMany() : '';

            const c = await prisma.kickoff.createMany({
                data: input,
            });

            logger.debug({ count: c }, 'Count.');

            if (c.count > 0) {
                logger.info(
                    `gw-worker-kickoffTimes > Updated ${c.count} fixtures successfully.`
                );
                return true;
            } else {
                throw new Error(
                    `gw-worker-kickoffTimes > Error saving entries to Prisma.`
                );
            }
        } catch (err) {
            logger.warn(
                `gw-worker-kickoffTimes > Something went wrong during entry updating.`
            );
            logger.error(err);
            return 1;
        }
    },
    updatePool: async (_, { input }, { prisma, pubsub, req }) => {
        const kt = input.kickoffTime;
        try {
            logger.debug(
                { headers: req.headers, body: req.body },
                `gw-worker-${kt} > Update pool mutation request.`
            );
            const inputId = input.id;
            logger.info(
                `gw-worker-${kt} > Finding entry ${inputId} to mutate.`
            );

            // do the check to see if +21 and/or A4S case applies here. 

            // if over 21 WON = False

            // if A4S and < 22 total goals get into an array. 

            // Otherwise rank them with a "-"

            // if thats the case ^^ we can update the "WON" category here. 

            // we should do an "if" check when we want to rank entries to see: 
            
            // // if each entry has all 4 players that score, then put them into an array to rank. 

            const entry = await prisma.entry.update({
                where: {
                    id: input.id,
                },
                data: {
                    goals: input.goals,
                    own_goals: input.own_goals,
                    net_goals: input.net_goals,
                },
            });

            // Get and re-sort the pool
            logger.info(`gw-worker-${kt} > Fetching pool ${entry.poolId}.`);

            const pool = await prisma.pool.findUnique({
                where: {
                    id: entry.poolId,
                },
                include: {
                    owner: true,
                    entries: true,
                },
            });

            // 

            const sortedEntries = pool.entries.sort(sortByNetGoalsDsc);

            logger.info(`gw-worker-${kt} > Finished sorting entries.`);
            logger.debug(
                { sortedEntries: sortedEntries },
                `gw-worker-${kt} > Sorted entries.`
            );

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
            }

            logger.info(`gw-worker-${kt} > All new standings stored.`);
            logger.debug(
                { sortedEntries: sortedEntries },
                `gw-worker-${kt} > Sorted entries array.`
            );

            pool.entries = sortedEntries;

            pubsub.publish('POOL_UPDATED', { poolUpdated: pool });
            logger.info(`gw-worker-${kt} > POOL_UPDATED published.`);
            return pool;
        } catch (err) {
            logger.warn(
                `gw-worker-${kt} > Something went wrong during entry updating.`
            );
            logger.error(err);
        }
    },
    updatePlayer: async (_, { input }, { prisma, req }) => {
        const kt = input.kickoffTime;
        try {
            logger.debug(
                { headers: req.headers, body: req.body },
                `gw-worker-${kt} > Update player mutation request.`
            );
            logger.info(`gw-worker-${kt} > Updating player ${input.id}`);

            const player = await prisma.player.update({
                where: {
                    id: input.id,
                },
                data: {
                    goals: input.goals,
                    own_goals: input.own_goals,
                    net_goals: input.net_goals,
                },
            });

            if (player.id !== input.id) {
                throw new Error(
                    `gw-worker-${kt} > Failed to update player in Prisma.`
                );
            } else {
                logger.info(`gw-worker-${kt} > Player updated.`);
                logger.debug(
                    { player: player },
                    `gw-worker-${kt} > Player object.`
                );
                return player;
            }
        } catch (err) {
            logger.warn(`gw-worker-${kt} > Error updating player.`);
            logger.error(err);
        }
    },
};

export default Mutation;
