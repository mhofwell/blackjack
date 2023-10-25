// import { parentPort } from 'worker_threads';
import prisma from '../prisma/client.js';
import { parentPort } from 'worker_threads';
import getLogger from '../logging/logger.js';

const logger = getLogger('worker');

const getWeeklyFixtures = async () => {
    await prisma.fixtures.deleteMany();

    let gameWeekId;

    try {
        const res = await fetch(
            `https://fantasy.premierleague.com/api/fixtures?future=1`
        );

        if (!res) {
            throw new Error(
                'Could not fetch upcoming fixtures for next gameweek from EPL'
            );
        }

        const data = await res.json();

        logger.info('Success fetching future gameweek data.');

        // get the gameweekId
        gameWeekId = data[0].event;

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
        logger.info(
            { Kickoff_times: kickoffTimesToSave },
            'Kickoff times fetched and sorted successfully'
        );
        logger.debug({ Kickoff_times: kickoffTimesToSave });

        const count = await prisma.fixtures.createMany({
            data: kickoffTimesToSave,
        });
        logger.info({ count: count }, `Count of fixtures: ${count}`);
        logger.debug({ count: count });
    } catch (err) {
        if (parentPort) {
            parentPort.postMessage('Something went wrong...');
            parentPort.postMessage(err);
            process.exit(1);
        } else {
            logger.error({ error: err }, 'Something went wrong...');
            logger.trace({ error: err });
            process.exit(1);
        }
    }
    if (parentPort) {
        parentPort.postMessage(
            `-----> Updated fixtures for gameweek ${gameWeekId}.`
        );
        parentPort.postMessage('done');
    } else {
        logger.info(`-----> Updated fixtures for gameweek ${gameWeekId}`);
        logger.info('done');
        process.exit(0);
    }
};

getWeeklyFixtures();
