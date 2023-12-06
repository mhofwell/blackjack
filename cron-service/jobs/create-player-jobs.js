const path = require('path');
const Bree = require('bree');
const { parentPort } = require('worker_threads');
const dayjs = require('dayjs');
const fetchGQL = require('../utils/fetch.js');

// env
const dotenv = require('dotenv');
dotenv.config();

// Logger setup
const getLogger = require('../logging/logger.js');
const logger = getLogger('worker');

const createGoalUpdateJobs = async () => {
    const query = `query Query {
        allKickoffTimes {
          id
          game_week_id
          kickoff_time
          ms_kickoff_time
          number_of_fixtures
        }
      }`;

    const res = await fetchGQL(query, null);

    const fixtures = res.allKickoffTimes;

    if (parentPort) {
        parentPort.postMessage(
            'Worker started to create goal update jobs...👷'
        );
    } else {
        logger.info('Worker started to create goal update jobs...👷');
    }

    const jobPath = path.resolve('./jobs/update-player-data.js');

    let newCronJobs = [];

    fixtures.forEach((fixture) => {
        newCronJobs.push({
            name: `gw-worker-${fixture.kickoff_time}`,
            path: jobPath,
            date: dayjs(fixture.kickoff_time).toDate(),
            // interval: '10s',
            outputWorkerMetadata: false,
            worker: {
                workerData: {
                    kickoffTime: fixture.kickoff_time,
                    numberOfFixtures: fixture.number_of_fixtures,
                    gameWeekId: fixture.game_week_id,
                },
            },
        });
    });

    if (newCronJobs.length !== fixtures.length) {
        throw new Error('Something went wrong creating cron jobs.');
    }

    if (parentPort) {
        parentPort.postMessage(
            'Jobs to update player goals created successfully 🚀'
        );
    } else {
        logger.info('Jobs to update player goals successfully 🚀');
        logger.debug({ newCronJobs: newCronJobs }, 'New cron jobs');
    }

    let i = 0;
    async function workerMessageHandler(message) {
        setTimeout(() => {
            logger.info(`${message.name} > ${message.message}`);
            if (message.message === 'done') {
                i++;
            }
            if (i === fixtures.length) {
                i = 0;
                logger.info(
                    'Success! All gameweek jobs completed successfully 🚀 🚀 🚀'
                );
                cron.stop();
            }
        }, 500);
    }

    const cron = new Bree({
        root: false,
        jobs: newCronJobs,
        logger: logger,
        outputWorkerMetadata: false,
        removeCompleted: true,
        workerMetadata: true,
        workerMessageHandler: workerMessageHandler,
        errorHandler: (error, workerMetadata) => {
            if (workerMetadata.threadId) {
                logger.warn(
                    `There was an warn while running a worker ${workerMetadata.name} with thread ID: ${workerMetadata.threadId}`
                );
            } else {
                logger.warn(
                    `There was an error while running worker [ ${workerMetadata.name} ]`
                );
            }
            logger.error(error);
        },
    });

    if (parentPort) {
        parentPort.postMessage(
            `${newCronJobs.length} jobs to update player data queued...`
        );
    } else {
        logger.info(
            `${newCronJobs.length} jobs to update player data queued...`
        );
    }
    await cron.start();
};

createGoalUpdateJobs();
