import path from 'path';
import Bree from 'bree';
import prisma from '../prisma/client.js';
import { parentPort } from 'worker_threads';
// import getLogger from '../logging/logger.js';

// const logger = getLogger('worker');

const createGoalUpdateJobs = async () => {
    const fixtures = await prisma.fixtures.findMany();

    console.log('Starting goal update jobs...');

    const appDir =
        '/Users/bigviking/Documents/GitHub/Projects/blackjack/server/';

    let newCronJobs = [];

    fixtures.forEach((fixture) => {
        newCronJobs.push({
            name: `gw-worker-${fixture.kickoff_time}`,
            path: path.join(appDir + '/jobs', 'update-player-data.js'),
            // date: new Date(fixture.kickoff_time),
            interval: '10s',
            outputWorkerMetadata: false,
            worker: {
                workerData: {
                    kickoffTime: fixture.kickoff_time,
                    numberOfFixtures: fixture.number_of_fixtures,
                    gameWeekId: fixture.game_week_id,
                },
            },
        });
        // logger.debug({ newCronJobs: newCronJobs }, 'Kickoff cron jobs.');
        return newCronJobs;
    });

    console.log('Kickoff time cron jobs created successfully.', newCronJobs);

    async function workerMessageHandler(message) {
        setTimeout(() => {
            console.log(
                `Worker Name: ${message.name}, Message: ${message.message}`
            );
        }, 1000);
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
                console.error(
                    { error: error },
                    `There was an error while running a worker ${workerMetadata.name} with thread ID: ${workerMetadata.threadId}`
                );
            } else {
                console.error(
                    { error: error },
                    `There was an error while running a worker ${workerMetadata.name}`
                );
            }
        },
    });
    if (parentPort) {
        parentPort.postMessage('Jobs to update player data started...');
    } else {
        console.log('Jobs to update player data started...');
    }
    await cron.start();
};

createGoalUpdateJobs();
