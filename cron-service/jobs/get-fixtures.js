// worker messaging
const { parentPort } = require('worker_threads');

// env
const dotenv = require('dotenv');
dotenv.config();

// GraphQL utility
const fetchGQL = require('../utils/fetch.js');

// Logger
const getLogger = require('../logging/logger.js');
const logger = getLogger('worker');

const getWeeklyFixtures = async () => {
    if (parentPort) {
        parentPort.postMessage(
            'Starting worker to collect gameweek fixtures...👷'
        );
    } else {
        logger.info('Starting worker to collect gameweek fixtures...👷');
    }

    let gameWeekId;

    try {
        const res = await fetch(process.env.EPL_API_FUTURE);

        if (!res) {
            throw new Error(
                'Could not fetch upcoming fixtures for next gameweek from EPL servers.'
            );
        }

        const data = await res.json();

        if (parentPort) {
            parentPort.postMessage('Success fetching future gameweek data.');
        } else {
            logger.info('Success fetching future gameweek data.');
            logger.debug({ data: data }, 'Data');
        }

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

        if (parentPort) {
            parentPort.postMessage([
                'Kickoff times fetched and sorted successfully.',
            ]);
        } else {
            logger.info('Kickoff times fetched and sorted successfully.');
            logger.debug({
                kickoffTimes: kickoffTimes,
            });
        }

        const query = `mutation Mutation($input: [kickoffTimeInput!]!) {
            updateKickoffTimes(input: $input)
          }`;

        const queryData = {
            input: kickoffTimesToSave,
        };

        console.log('KickoffTimes', kickoffTimesToSave);

        const result = await fetchGQL(query, queryData);

        if (parentPort) {
            parentPort.postMessage(
                `Saved new fixture times for gameweek ${gameWeekId} 🚀`
            );
            parentPort.postMessage('done');
            process.exit(0);
        } else {
            logger.info(
                `Saved new fixture times for gameweek ${gameWeekId} 🚀`
            );
            process.exit(0);
        }
    } catch (err) {
        if (parentPort) {
            parentPort.postMessage('Something went wrong...');
            process.exit(1);
        }
        logger.error(err);
        process.exit(1);
    }
};

getWeeklyFixtures();
