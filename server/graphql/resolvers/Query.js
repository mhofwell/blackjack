import 'dotenv/config';

const Query = {
    // return a user
    user: async (parent, args, { prisma }) => {
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
    entry: async (parent, args, { prisma }) => {
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
        return entry;
    },
    // return all entries across all pools

    allEntries: async (parent, args, { prisma }) => {
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
    pools: async (parent, args, { prisma }) => {
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
    pool: async (parent, args, { prisma }) => {
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
    allPlayers: async (parent, args, { prisma }) => {
        const players = await prisma.player.findMany();
        return players;
    },
    player: async (parent, args, { prisma }) => {
        const { id } = args;
        const player = await prisma.player.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        return player;
    },
    playerEntries: async (parent, args, { prisma }) => {
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
        return entries;
    },
    getGameweekPlayers: async (parent, args, { prisma }) => {
        
        const { input } = args;
        const k = input.kickoffTime;
        const n = input.numberOfFixtures;
        const players = [];
        const teamIdArray = [];

        try {
            let res = await fetch(process.env.EPL_NEXT_GW);

            if (!res) {
                throw new Error(
                    '---------> Cannot fetch upcoming fixture information from EPL API, check connection.'
                );
            }
            console.log(
                `---------> Upcoming fixture information fetched for the next gameweek.`
            );

            let data = await res.json();
            const weeklyFixtures = data.slice(0, n - 1);

            console.log('Weekly Fixtures ', weeklyFixtures);

            await weeklyFixtures.forEach((fixture) => {
                const fixtureDate = new Date(fixture.kickoff_time).toString();

                if (fixtureDate === k) {
                    teamIdArray.push(fixture.team_a);
                    teamIdArray.push(fixture.team_h);
                }
            });

            console.log(`teamIdArray is ${teamIdArray}`);

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
                        '---------> Cannot save player data to PRISMA'
                    );
                }
                p.forEach((player) => {
                    players.push(player);
                });
                console.log(
                    `---------> Players fetched for club ${teamIdArray[id]}`
                );
            }
            console.log('Players fetched: ', players);
            return players;
        } catch (err) {
            console.error(err);
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
