import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sortByDateAsc = (a, b) => {
    return new Date(a.date) - new Date(b.date);
};

const test = async () => {
    // get all player numbers
    const allPlayersInPool = await prisma.player.findMany({
        select: {
            id: true,
        },
    });

    let allFixturesForThePool = [];

    for (const p of allPlayersInPool) {
        const { id } = p;
        // get the player
        const player = await prisma.player.findUnique({
            where: {
                id: id,
            },
            include: {
                club: true,
            },
        });
        console.log(player);

        // get player fixtures
        const res = await fetch(
            `https://fantasy.premierleague.com/api/element-summary/${id}/`
        );

        const data = await res.json();
        const playerFixtures = data.fixtures;

        // for each fixture the player is in, see if it exists already. If not, add fixture information.

        playerFixtures.forEach(async (fixture) => {
            const homeTeam = await prisma.club.findUnique({
                where: {
                    id: team_h,
                },
                select: {
                    name: true,
                },
            });

            const i = allFixturesForThePool.indexOf(fixture.id);
            if (i === -1) {
                // Fixture does not exist, add the fixture

                const fixtureToAdd = {};
            } else {
            }
        });

        //     playerFixtures.forEach((fixture) => {
        //         // removing duplicate games
        //         const index = allFixturesForThePool.indexOf(fixture.id);
        //         if (index > -1) {
        //             // this means the fixture ID is NOT in the allFixturesForThePool
        //             // if the ID is NOT in the allFixturesForThePool then add it in a new fixture object to push into allFixtures array.

        //             const player = await prisma.player.findUnique({
        //                 where: {
        //                     id: id,
        //                 },
        //                 select:  {
        //                     fn: true,
        //                     ln: true,
        //                     avatar: true,
        //                     net_goals: true,

        //                 },
        //                 include: {
        //                     club: true
        //                 }

        //             })

        //         } else {
        //             console.log(
        //                 `Player id: ${id} Fixture: ${fixture.kickoff_time}`
        //             );

        //         }
        //     });
        // }

        // console.log(allFixturesForThePool);

        // const timeNow = Date.now();

        // const fixtureTimeStamp = Date.parse(allFixturesForThePool[0]);
        // const difference = fixtureTimeStamp - timeNow;

        // console.log(`time difference is: ${difference}`);

        // const hours = Math.floor(difference / 3600000);
        // const minutes = Math.floor((difference % 3600000) / 60000);
        // const seconds = Math.floor(((difference % 360000) % 60000) / 1000);
        // console.log(`${hours}h ${minutes}m ${seconds}s`);
    }
};

test();

// what is the time now.

// what is the difference in time between the next game and now.

// set a function to run when time difference reaches 0.

// after the game get the time now and find the difference in between the next game.

// set a function to run when the time difference reaches 0.

// continue until season is finished

[
    {
        fixture_id,
        fixture_kickoff, 
        home_club: {
            name: Chelsea,
            players: [
                {
                    fn,
                    ln,
                    net_goals,
                },
            ],
        },
        away_club: {
            name: Chelsea,
            players: [
                {
                    fn,
                    ln,
                    net_goals,
                },
            ],
        },
        entries: [
            {
                fn,
                ln,
                goals,
            },
            {
                fn,
                ln,
                goals,
            },
        ],
    },
];
