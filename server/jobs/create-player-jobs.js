import path from 'path';
import Bree from 'bree';
import prisma from '../prisma/client.js';
import { parentPort } from 'worker_threads';
import getLogger from '../logging/logger.js';

const logger = getLogger('worker');

const createGoalUpdateJobs = async () => {
    const fixtures = await prisma.fixtures.findMany();
    const appDir =
        '/Users/bigviking/Documents/GitHub/Projects/blackjack/server/';

    let newCronJobs = [];
    try {
        fixtures.forEach((fixture) => {
            newCronJobs.push({
                name: `gw-worker-${fixture.kickoff_time}`,
                path: path.join(appDir + '/jobs', 'update-player-data.js'),
                date: new Date(fixture.kickoff_time),
                outputWorkerMetadata: false,
                worker: {
                    workerData: {
                        kickoffTime: fixture.kickoff_time,
                        numberOfFixtures: fixture.number_of_fixtures,
                        gameWeekId: fixture.game_week_id,
                    },
                },
            });
            logger.info('Kickoff time jobs created successfully.');
            logger.debug({ newCronJobs: newCronJobs });
            return newCronJobs;
        });

        async function workerMessageHandler(message) {
            setTimeout(() => {
                logger.info(
                    `Worker Name: ${message.name}, Message: ${message.message}`
                );
            }, 1000);
        }
    } catch (err) {
        logger.error({ error: err }, 'Error creating player jobs.');
        logger.trace({ error: err });
    }

    const cron = new Bree({
        root: false,
        jobs: newCronJobs,
        outputWorkerMetadata: false,
        removeCompleted: true,
        workerMessageHandler: workerMessageHandler,
        errorHandler: (error, workerMetadata) => {
            // workerMetadata will be populated with extended worker information only if
            // Bree instance is initialized with parameter `workerMetadata: true
            if (workerMetadata.threadId) {
                logger.error(
                    { error: error },
                    `There was an error while running a worker ${workerMetadata.name} with thread ID: ${workerMetadata.threadId}`
                );
            } else {
                logger.error(
                    { error: error },
                    `There was an error while running a worker ${workerMetadata.name}`
                );
            }
        },
    });
    if (parentPort) {
        parentPort.postMessage('Creating jobs to update player data.');
    } else {
        logger.info('Creating jobs to update player data.');
    }
    await cron.start();
};

createGoalUpdateJobs();
