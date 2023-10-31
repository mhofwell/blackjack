import 'dotenv/config';
import getLogger from '../../logging/logger.js';

const logger = getLogger('api');

const Query = {
    // return a user
    user: async (parent, args, { prisma }, contextValue) => {
        try {
            const { id } = args;
            logger.info(`Fetching user ${id}`);
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
            logger.info(`Fetched user ${id} successfully.`);
            logger.debug({ user: user }, `User ${id}.`);
            return user;
        } catch (err) {
            logger.error(
                {
                    Error: err,
                },
                'Something went wrong fetching the user.'
            );
        }
    },
    // return an entry for a specific user in a particular pool
    entry: async (parent, args, { prisma }) => {
        try {
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
            logger.info(`Fetched entry ${id} successfully.`);
            logger.debug({ entry: entry }, 'Entry');
            return entry;
        } catch (err) {
            logger.error({ error: err }, `Error fetching entry ${id}.`);
            // logger.trace({ error: err });
        }
    },
    // return all entries across all pools
    allEntries: async (parent, args, { prisma }) => {
        try {
            console.log('Getting all entries.');
            const entries = await prisma.entry.findMany({
                include: {
                    user: true,
                    players: true,
                    pool: true,
                },
            });
            console.log('Fetched all entries successfully.');
            // logger.debug({ entries: entries }, 'Entries');
            return entries;
        } catch (err) {
            console.error('Error fetching all entries.', err);
            // logger.trace({ error: err });
        }
    },
    // return all pools with all entries, players, users
    pools: async (parent, args, { prisma }) => {
        try {
            console.log('Fetching all pools.');
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
            console.log('Fetched all pools successfully.');
            // logger.debug({ pools: pools }, 'Pools');
            return pools;
        } catch (err) {
            console.error('Something went wrong fetching all pools.', err);
            // logger.trace({ error: err });
        }
    },
    // return a single pool with all entries, players, users
    pool: async (parent, args, { prisma }) => {
        try {
            const { id } = args;
            console.log(`Fetching pool ${id}.`);
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
            console.log(`Fetched pool ${id} successfully.`);
            // logger.debug({ pool: pool }, 'Pool');
            return pool;
        } catch (err) {
            console.error('Something went wrong fetching a pool', err);
            // logger.trace({ error: err });
        }
    },
    allPlayers: async (parent, args, { prisma }) => {
        try {
            console.log('Fetching all players');
            const players = await prisma.player.findMany();
            console.log('Fetched all players successfully.');
            // logger.debug({ players: players }, 'Players');
            return players;
        } catch (err) {
            console.error("Something wen't wrong fetching all players.", err);
            // logger.trace({ error: err });
        }
    },
    player: async (parent, args, { prisma }) => {
        try {
            const { id } = args;
            console.log(`Fetching player ${id}`);
            const player = await prisma.player.findUnique({
                where: {
                    id: parseInt(id),
                },
            });
            console.log(`Fetched player ${id} successfully.`, player);
            return player;
        } catch (err) {
            console.error('Something went wrong getting a single player', err);
        }
    },
    playerEntries: async (parent, args, { prisma }) => {
        try {
            const { id } = args;
            console.log(`Fetching all entries by player id ${id}`);
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
                console.log(
                    `Fetched all entries by player id ${id} successfully.`
                );
                return entries;
            } else {
                throw new Error(`No entries found!`);
            }
            // logger.debug({ entries: entries }, 'Entries');
        } catch (err) {
            console.error(
                'Something went wrong getting all players by player id',
                err
            );
            // logger.debug({ error: err });
        }
    },
    getGameweekPlayers: async (parent, args, { prisma }) => {
        const { input } = args;
        const inputKT = input.kickoffTime;
        const n = input.numberOfFixtures;
        const players = [];
        const teamIdArray = [];

        try {
            console.log(
                `Fetching all gameweek players for kickoff time ${inputKT}.`
            );
            let res = await fetch(
                'https://fantasy.premierleague.com/api/fixtures?future=1'
            );

            if (!res) {
                throw new Error(
                    'Cannot fetch upcoming fixture information from EPL API, check connection.'
                );
            }

            let data = await res.json();
            // logger.debug({ data: data }, 'Fixture Data');

            const weeklyFixtures = data.slice(0, n - 1);
            console.log(`${n} fixture(s) in this gameweek.`);

            await weeklyFixtures.forEach((fixture) => {
                const fixtureKT = new Date(fixture.kickoff_time).toString();

                if (fixtureKT === inputKT) {
                    teamIdArray.push(fixture.team_a);
                    teamIdArray.push(fixture.team_h);
                }
            });

            console.log(`Teams playing at ${inputKT}.`, teamIdArray);

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
                    throw new Error('Cannot fetch player data from PRISMA.');
                }
                p.forEach((player) => {
                    players.push(player);
                });
                console.log(`Players fetched for club ${teamIdArray[id]}`);
            }
            console.log(`All players fetched for kickoff time ${inputKT}`);
            return players;
        } catch (err) {
            console.error(`Error fetching club players`, err);
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
