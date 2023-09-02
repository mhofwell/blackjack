import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const test = async () => {
    // get all player numbers
    const playerNumbers = await prisma.player.findMany({
        select: {
            id: true,
        },
    });

    let allFixtureTimes = [];

    for (const player of playerNumbers) {
        const id = player.id;
        const res = await fetch(
            `https://fantasy.premierleague.com/api/element-summary/${id}/`
        );
        const data = await res.json();
        const fixtureArray = data.fixtures;

        fixtureArray.forEach((fixture) => {
            const index = allFixtureTimes.indexOf(fixture.kickoff_time);
            if (index > -1) {
                return;
            } else {
                console.log(`Player id: ${id} Fixture: ${fixture.kickoff_time}`);
                allFixtureTimes.push(fixture.kickoff_time);
            }
        });
    }

    console.log(allFixtureTimes);
};

test();

// what is the time now. 

// what is the difference in time between the next game and now. 

// set a function to run when time difference reaches 0. 

// after the game get the time now and find the difference in between the next game. 

// set a function to run when the time difference reaches 0. 

// continue until season is finished