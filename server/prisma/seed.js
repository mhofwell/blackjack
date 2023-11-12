import prisma from './client.js';

import sortByNetGoalsDsc from '../utils/sort-net-goals.js';
import { fnln, picks, users } from './seed-data.js';

async function sortPools() {
    const poolsToSort = await prisma.pool.findMany({
        include: {
            entries: true,
        },
    });
    console.log('PTS', poolsToSort);

    for (const pool of poolsToSort) {
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
            console.log(res);
        }
    }
}

async function main() {
    // setup the players array
    let players = [];

    const res = await fetch(
        'https://fantasy.premierleague.com/api/bootstrap-static'
    );
    const eplData = await res.json();

    // filter players from the picks array.
    await eplData.elements.map((player) => {
        picks.forEach((pick) => {
            if (pick === player.second_name) {
                players.push({
                    id: player.id,
                    avatar: null,
                    fn: player.first_name,
                    ln: player.second_name,
                    avatar: player.photo,
                    team_id: player.team,
                    goals: player.goals_scored,
                    own_goals: player.own_goals,
                    net_goals: player.goals_scored - player.own_goals,
                });
            }
        });
    });

    await eplData.elements.map((player) => {
        // filter players from the fnln array.
        fnln.forEach((pick) => {
            if (
                pick.fn === player.first_name &&
                pick.ln === player.second_name
            ) {
                players.push({
                    id: player.id,
                    avatar: null,
                    fn: player.first_name,
                    ln: player.second_name,
                    avatar: player.photo,
                    team_id: player.team,
                    goals: player.goals_scored,
                    own_goals: player.own_goals,
                    net_goals: player.goals_scored - player.own_goals,
                });
            }
        });
    });

    // search for clubs of players we have in the players array.
    const clubArray = await eplData.teams.map((club) => {
        return {
            id: club.id,
            name: club.name,
            logo: null,
        };
    });

    // add club data to the player objects in the players array.
    await players.map((player) => {
        clubArray.forEach((club) => {
            if (player.team_id === club.id) {
                player.club_name = club.name;
                player.club_logo = club.logo;
            }
        });
    });

    // insert players into our database.
    for (const player of players) {
        // we have to handle duplicate clubs and not create a new one.
        const club = await prisma.club.findUnique({
            where: {
                id: player.team_id,
            },
        });

        let data = {};

        if (!club) {
            data = {
                id: player.id,
                avatar: player.avatar,
                fn: player.fn,
                ln: player.ln,
                club: {
                    create: {
                        id: player.team_id,
                        name: player.club_name,
                        logo: player.club_logo,
                    },
                },
                goals: player.goals,
                own_goals: player.own_goals,
                net_goals: player.goals - player.own_goals,
            };
        } else if (club) {
            data = {
                id: player.id,
                avatar: player.avatar,
                fn: player.fn,
                ln: player.ln,
                club: {
                    connect: {
                        id: player.team_id,
                    },
                },
                goals: player.goals,
                own_goals: player.own_goals,
                net_goals: player.goals - player.own_goals,
            };
        }

        const newPlayer = await prisma.player.create({
            data,
            select: {
                id: true,
                fn: true,
                club: { select: { name: true } },
            },
        });
        console.log(newPlayer);
    }

    //  create users in our database.
    for (const user of users) {
        const newUser = await prisma.user.create({
            data: {
                fn: user.fn,
                ln: user.ln,
            },
            select: {
                fn: true,
                id: true,
            },
        });
        console.log(newUser);
    }

    // Create pools attached to users.

    const teddyId = await prisma.user.findFirst({
        where: {
            fn: 'Teddy',
        },
        select: {
            id: true,
        },
    });
    console.log("Teddy's Id ", teddyId);

    const pools = await prisma.pool.createMany({
        data: [
            {
                name: 'CANADA',
                userId: teddyId.id,
                season: 2023,
                league: 'EPL',
                region: 'CANADA',
            },
            {
                name: 'UK',
                userId: teddyId.id,
                region: 'UK',
                season: 2023,
                league: 'EPL',
                region: 'UK',
            },
        ],
    });

    console.log(pools);

    // Entries of users attached to pools

    for (const user of users) {
        let entryPicks = [];
        let p;

        const databaseUserId = await prisma.user.findFirst({
            where: {
                ln: user.ln,
                fn: user.fn,
            },
            select: {
                id: true,
            },
        });

        if (user.entry.p1) {
            p = { id: user.entry.p1 };
            entryPicks.push(p);
        }
        if (user.entry.p2) {
            p = { id: user.entry.p2 };
            entryPicks.push(p);
        }
        if (user.entry.p3) {
            p = { id: user.entry.p3 };
            entryPicks.push(p);
        }
        if (user.entry.p4) {
            p = { id: user.entry.p4 };
            entryPicks.push(p);
        }

        const userPool = user.entry.pool;

        console.log('User Pool', userPool);

        const poolId = await prisma.pool.findFirst({
            where: {
                name: userPool,
            },
            select: {
                id: true,
            },
        });

        console.log('Pool Id: ', poolId);

        // Entry data
        const data = {
            pool: {
                connect: {
                    id: poolId.id,
                },
            },
            user: {
                connect: { id: databaseUserId.id },
            },
            suit: user.entry.suit,
            players: {
                connect: entryPicks,
            },
        };

        const newEntry = await prisma.entry.create({
            data,
            select: {
                id: true,
                players: {
                    select: {
                        goals: true,
                        own_goals: true,
                        net_goals: true,
                    },
                },
            },
        });

        const goals =
            newEntry.players[0].goals +
            newEntry.players[1].goals +
            newEntry.players[2].goals +
            newEntry.players[3].goals;

        const own_goals =
            newEntry.players[0].own_goals +
            newEntry.players[1].own_goals +
            newEntry.players[2].own_goals +
            newEntry.players[3].own_goals;

        const net_goals =
            newEntry.players[0].net_goals +
            newEntry.players[1].net_goals +
            newEntry.players[2].net_goals +
            newEntry.players[3].net_goals;

        console.log(
            `goals ${goals}, own_goals ${own_goals}, net_goals ${net_goals}`
        );

        const updatedEntry = await prisma.entry.update({
            where: { id: newEntry.id },
            data: {
                goals: goals,
                own_goals: own_goals,
                net_goals: net_goals,
            },
            select: {
                user: {
                    select: {
                        fn: true,
                    },
                },
                goals: true,
                own_goals: true,
                net_goals: true,
            },
        });
        console.log(updatedEntry);
    }
}
main()
    .then(async () => {
        await sortPools();
        console.log('Sorted.');
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
