import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { fnln, picks, users } from './seed-data.js';

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
            },
            {
                name: 'UK',
                userId: teddyId.id,
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
            season: user.entry.season,
            league: user.entry.league,
            pool: {
                connect: {
                    id: poolId.id,
                },
            },
            region: user.entry.region,
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
                user: {
                    select: {
                        fn: true,
                    },
                },
            },
        });
        console.log('Entry Id ', newEntry);
    }
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
