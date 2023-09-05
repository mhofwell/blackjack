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


// weekly cron job on Sunday at midnight PDT
// get all the fixtures for the coming week
//https://fantasy.premierleague.com/api/fixtures?future=1

// get clubs for each fixture


// get players in those clubs in each fixture. 


// get entries that contain those players


// get all kickoff times for those fixtures. 


// save fixtures in Postgres


// stack rank fixture array in order from soonest to latest


// get time now 


// set coundown for cron job 


// CRON 2 when timer = 0 launch second cron job for 3h to hit live update API and scan for player ids in that match every 2 minutes. 


// run mutation to update player and entry scores. 


// get difference between time now and time to next fixture. 


// repeat CRON 2 job

