import 'dotenv/config';
import getLogger from '../../logging/logger.js';

const logger = getLogger('api');

const Query = {
    // return a user
    user: async (parent, args, { prisma, req }) => {
        try {
            logger.debug(
                { headers: req.headers, body: req.body },
                'User query request.'
            );
            const { id } = args;
            logger.info(`Fetching user ${id}`);
            const user = await prisma.user.findUnique({
                where: {
                    id: ids,
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
            logger.info(`Fetched user successfully.`);
            logger.debug({ user: user }, `User ${id}.`);
            return user;
        } catch (err) {
            logger.warn('Something went wrong fetching the user.');
            logger.error(err);
        }
    },
    // return an entry for a specific user in a particular pool
    entry: async (parent, args, { prisma, req }) => {
        try {
            logger.debug(
                { headers: req.headers, body: req.body },
                'Entry query request.'
            );
            const { id } = args;
            console.log(`Fetching entry ${id}.`);
            const entry = await prisma.entry.findUnique({
                where: {
                    id: id,
                },
                include: {
                    players: true,
                    pool: true,
                    user: true,
                },
            });
            logger.info(`Fetched entry successfully.`);
            logger.debug({ entry: entry }, 'Entry');
            return entry;
        } catch (err) {
            logger.warn(`Error fetching entry.`);
            logger.error(err);
        }
    },
    // return all entries across all pools
    allEntries: async (parent, args, { prisma, req }) => {
        try {
            logger.debug(
                { headers: req.headers, body: req.body },
                'All entries query request.'
            );
            logger.info('Getting all entries.');
            const entries = await prisma.entry.findMany({
                include: {
                    user: true,
                    players: true,
                    pool: true,
                },
            });
            logger.info('Fetched all entries successfully.');
            logger.debug({ entries: entries }, 'Entries');
            return entries;
        } catch (err) {
            logger.warn(`Error fetching all entries.`);
            logger.error(err);
        }
    },
    // return all pools with all entries, players, users
    pools: async (parent, args, { prisma, req }) => {
        try {
            logger.debug(
                { headers: req.headers, body: req.body },
                'All pools query request.'
            );
            logger.info('Fetching all pools.');
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
            logger.info('Fetched all pools successfully.');
            logger.debug({ pools: pools }, 'Pools');
            return pools;
        } catch (err) {
            logger.warn(`Something went wrong fetching all pools.`);
            logger.error(err);
        }
    },
    // return a single pool with all entries, players, users
    pool: async (parent, args, { prisma, req }) => {
        try {
            logger.debug(
                { headers: req.headers, body: req.body },
                'Pool query request.'
            );
            const { id } = args;
            logger.info(`Fetching pool ${id}.`);
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
            logger.info(`Fetched the pool successfully.`);
            logger.debug({ pool: pool }, 'Pool');
            return pool;
        } catch (err) {
            logger.warn(`Something went wrong fetching a pool.`);
            logger.error(err);
        }
    },
    allPlayers: async (parent, args, { prisma, req }) => {
        try {
            logger.debug(
                { headers: req.headers, body: req.body },
                'All players query request.'
            );
            logger.info('Fetching all players');
            const players = await prisma.player.findMany();
            logger.info('Fetched all players successfully.');
            logger.debug({ players: players }, 'Players');
            return players;
        } catch (err) {
            logger.warn(`Something wen't wrong fetching all players.`);
            logger.error(err);
        }
    },
    player: async (parent, args, { prisma, req }) => {
        try {
            logger.debug(
                { headers: req.headers, body: req.body },
                'Player query request.'
            );
            const { id } = args;
            logger.info(`Fetching player ${id}`);
            const player = await prisma.player.findUnique({
                where: {
                    id: parseInt(id),
                },
            });
            logger.info(`Fetched player ${id} successfully.`, player);
            logger.debug({ player: player }, `Player object.`);
            return player;
        } catch (err) {
            logger.warn(`Something went wrong fetching a player.`);
            logger.error(err);
        }
    },
    playerEntries: async (_, args, { prisma, req }) => {
        const kt = args.kickoffTime;
        try {
            logger.debug(
                { headers: req.headers, body: req.body },
                `gw-worker-${kt} > Entries by player id query request.`
            );
            const { id } = args;
            logger.info(
                `gw-worker-${kt} > Fetching all entries by player id ${id}`
            );
            const entries = await prisma.entry.findMany({
                where: {
                    players: {
                        some: {
                            id: parseInt(id),
                        },
                    },
                },
            });
            if (entries !== null) {
                logger.info(
                    `gw-worker-${kt} > Fetched all entries by player id ${id} successfully.`
                );
                logger.debug(
                    { entries: entries },
                    `gw-worker-${kt} > Entries.`
                );
                return entries;
            } else {
                throw new Error(`gw-worker-${kt} > No entries found!`);
            }
        } catch (err) {
            logger.warn(
                `gw-worker-${kt} > Something went wrong getting all players by player id.`
            );
            logger.error(err);
        }
    },
    getGameweekPlayers: async (_, args, { prisma, req }) => {
        const { input } = args;
        const gw = input.gameWeekId;
        const kt = input.kickoffTime;
        const players = [];
        const teamIdArray = [];
        try {
            logger.debug(
                { headers: req.headers, body: req.body },
                `Get all gameweek ${gw} players query request..`
            );
            logger.info(`gw-worker-${kt} > Fetching all gameweek players.`);
            let res = await fetch(
                `https://fantasy.premierleague.com/api/fixtures?event=${gw}`
            );

            if (res === undefined || null) {
                throw new Error(
                    `${kt} > Cannot fetch gameweek information from EPL API, check connection.`
                );
            }

            const data = await res.json();

            logger.debug(
                { data: data },
                `gw-worker-${kt} > Weekly fixture data from EPL.`
            );

            await data.forEach((fixture) => {
                if (fixture.kickoff_time === kt) {
                    teamIdArray.push(fixture.team_a);
                    teamIdArray.push(fixture.team_h);
                }
            });

            logger.debug(
                { teamIdArray: teamIdArray },
                `gw-worker-${kt} > Teams playing.`
            );

            for (const id in teamIdArray) {
                const p = await prisma.player.findMany({
                    where: {
                        club_id: teamIdArray[id],
                    },
                    select: {
                        id: true,
                        goals: true,
                        net_goals: true,
                        own_goals: true,
                    },
                });
                if (!p) {
                    throw new Error(
                        `gw-worker-${kt} > Cannot fetch player data from PRISMA.`
                    );
                }
                p.forEach((player) => {
                    players.push(player);
                });
                logger.info(
                    `gw-worker-${kt} > Players fetched for club ${teamIdArray[id]}`
                );
            }
            logger.info(`gw-worker-${kt} > All players fetched.`);
            logger.debug({ players: players }, `gw-worker-${kt} > Players`);
            return players;
        } catch (err) {
            logger.warn(`gw-worker-${kt} > Error fetching club players`);
            logger.error(err);
            process.exit(1);
        }
    },
    login: async (parent, args, { prisma, req }) => {
        logger.debug(
            { headers: req.headers, body: req.body },
            'Login request.'
        );
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
};

export default Query;
