import 'dotenv/config';
import getLogger from '../../logging/logger.js';

const logger = getLogger('api');

const Query = {
    // return a user
    user: async (parent, args, { prisma }) => {
        try {
            logger.info('Fetching a user.');
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
            logger.info('Fetched user successfully.');
            logger.debug({ user: user });
            return user;
        } catch (err) {
            logger.error(
                { error: err },
                'Something went wrong fetching the user.'
            );
            logger.trace({ error: err });
        }
    },
    // return an entry for a specific user in a particular pool
    entry: async (parent, args, { prisma }) => {
        try {
            logger.info('Fetching a single entry.');
            const { id } = args;
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
            logger.info('Fetched single entry successfully.');
            logger.debug({ entry: entry });
            return entry;
        } catch (err) {
            logger.error({ error: err }, 'Error fetching a single entry.');
            logger.trace({ error: err });
        }
    },
    // return all entries across all pools

    allEntries: async (parent, args, { prisma }) => {
        try {
            logger.info('Getting all entries.');
            const entries = await prisma.entry.findMany({
                include: {
                    user: true,
                    players: true,
                    pool: true,
                },
            });
            logger.info('Fetched all entries successfully.');
            logger.info({ entries: entries });
            return entries;
        } catch (err) {
            logger.error({ error: err }, 'Error fetching all entries.');
            logger.trace({ error: err });
        }
    },
    // return all pools with all entries, players, users
    pools: async (parent, args, { prisma }) => {
        try {
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
            logger.debug({ pools: pools });
            return pools;
        } catch (err) {
            logger.error(
                { error: err },
                'Something went wrong fetching all pools.'
            );
            logger.trace({ error: err });
        }
    },
    // return a single pool with all entries, players, users
    pool: async (parent, args, { prisma }) => {
        try {
            logger.info('Fetching a single pool.');

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
            logger.info('Fetched a single pool successfully.');
            logger.debug({ pool: pool });
            return pool;
        } catch (err) {
            logger.error(
                { error: err },
                'Something went wrong fetching a pool'
            );
            logger.trace({ error: err });
        }
    },
    allPlayers: async (parent, args, { prisma }) => {
        try {
            logger.info('Getting all players');
            const players = await prisma.player.findMany();
            logger.info(
                { players: players },
                'Fetched all players successfully.'
            );
            logger.debug({ players: players });
            return players;
        } catch (err) {
            logger.error(
                { error: err },
                "Something wen't wrong fetching all players."
            );
            logger.trace({ error: err });
        }
    },
    player: async (parent, args, { prisma }) => {
        try {
            logger.info('Getting a single players');
            const { id } = args;
            const player = await prisma.player.findUnique({
                where: {
                    id: parseInt(id),
                },
            });
            logger.info('Fetched a single player successfully.');
            logger.info({ player: player });
            return player;
        } catch (err) {
            logger.error(
                { error: err },
                'Something went wrong getting a single player'
            );
            logger.trace({ error: err });
        }
    },
    playerEntries: async (parent, args, { prisma }) => {
        try {
            logger.info('Getting all entries by player id');
            const { id } = args;
            const entries = await prisma.entry.findMany({
                where: {
                    players: {
                        some: {
                            id: parseInt(id),
                        },
                    },
                },
            });
            logger.info('Fetched all entries by player id successfully.');
            logger.info({ entries: entries });
            return entries;
        } catch (err) {
            logger.error(
                { error: err },
                'Something went wrong getting all players by player id'
            );
            logger.debug({ error: err });
        }
    },
    getGameweekPlayers: async (parent, args, { prisma }) => {
        const { input } = args;
        const inputKT = input.kickoffTime;
        const n = input.numberOfFixtures;
        const players = [];
        const teamIdArray = [];

        try {
            let res = await fetch(process.env.EPL_NEXT_GW);

            if (!res) {
                throw new Error(
                    'Cannot fetch upcoming fixture information from EPL API, check connection.'
                );
            }

            let data = await res.json();
            logger.info(`Upcoming fixture information fetched.`);
            logger.debug({ data: data });

            const weeklyFixtures = data.slice(0, n - 1);

            await weeklyFixtures.forEach((fixture) => {
                const fixtureKT = new Date(fixture.kickoff_time).toString();

                if (fixtureKT === inputKT) {
                    teamIdArray.push(fixture.team_a);
                    teamIdArray.push(fixture.team_h);
                }
            });

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
                    throw new Error('Cannot save player data to PRISMA.');
                }
                p.forEach((player) => {
                    players.push(player);
                });
            }
            logger.info(`Players fetched for club ${teamIdArray[id]}`);
            logger.debug({ players: players });
            return players;
        } catch (err) {
            logger.error(
                { error: err },
                `Error fetching players for club ${teamIdArray[id]}`
            );
            logger.trace({ error: err });
            process.exit(1);
        }
    },
    login: async (parent, args, { prisma }) => {
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
