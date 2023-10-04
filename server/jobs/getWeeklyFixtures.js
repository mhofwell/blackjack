// import { parentPort } from 'worker_threads';
import { PrismaClient } from '@prisma/client';

const getWeeklyFixtures = async () => {
    const prisma = new PrismaClient();
    await prisma.fixtures.deleteMany();

    try {
        const res = await fetch(
            `https://fantasy.premierleague.com/api/fixtures?future=1`
        );

        const data = await res.json();

        // get the gameweekId
        const gameWeekId = data[0].event;

        // set up the array to hold the gameweek information
        const kickoffTimes = [];

        // get the length of the array that holds games in that game week. This will help us reduce our processing load.
        let numberOfFixtures = 0;

        // remove duplicate kickoff times, count fixtures, populate kickoffTimes array.
        for (const id in data) {
            if (
                data[id].event === gameWeekId &&
                kickoffTimes.indexOf(data[id].kickoff_time) < 0
            ) {
                kickoffTimes.push(data[id].kickoff_time);
                numberOfFixtures = ++numberOfFixtures;
            } else {
                if (kickoffTimes.indexOf(data[id].kickoff_time) > -1) {
                    numberOfFixtures = ++numberOfFixtures;
                }
            }
        }

        console.log(kickoffTimes);
        console.log(numberOfFixtures);

        let kickoffTimesToSave = [];

        kickoffTimes.forEach((kickoffTime) => {
            const date = new Date(kickoffTime);
            const ms = date.getTime();

            const newEntry = {
                kickoff_time: kickoffTime,
                game_week_id: gameWeekId,
                number_of_fixtures: numberOfFixtures,
                ms_kickoff_time: ms,
            };

            kickoffTimesToSave.push(newEntry);
        });
        console.log(kickoffTimesToSave);

        const count = await prisma.fixtures.createMany({
            data: kickoffTimesToSave,
        });
        console.log('count: ', count);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    process.exit(0);
};

getWeeklyFixtures();
