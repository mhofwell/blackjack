import path from 'path';
import Bree from 'bree';
import prisma from '../prisma/client.js';
import { getEnvironmentData } from 'worker_threads';

const createGoalUpdateJobs = async () => {
    const fixtures = await prisma.fixtures.findMany();
    const appDir =
        '/Users/bigviking/Documents/GitHub/Projects/blackjack/server/';

    let newCronJobs = [];

    fixtures.forEach((fixture) => {
        newCronJobs.push({
            name: `gw-worker-${fixture.kickoff_time}`,
            path: path.join(appDir + '/jobs', 'updateGoalData.js'),
            interval: '20s',
            timeout: 0,
            outputWorkerMetadata: false,
            worker: {
                workerData: {
                    kickoffTime: fixture.kickoff_time,
                    numberOfFixtures: fixture.number_of_fixtures,
                    gameWeekId: fixture.game_week_id,
                },
            },
        });
        return newCronJobs;
    });

    async function workerMessageHandler(message) {
        setTimeout(() => {
            console.log(`Name: ${message.name}, Message: ${message.message}`);
        }, 1000);
    }

    const cron = new Bree({
        root: false,
        jobs: newCronJobs,
        outputWorkerMetadata: false,
        workerMessageHandler: workerMessageHandler,
        errorHandler: (error, workerMetadata) => {
            // workerMetadata will be populated with extended worker information only if
            // Bree instance is initialized with parameter `workerMetadata: true
            if (workerMetadata.threadId) {
                console.log(
                    `There was an error while running a worker ${workerMetadata.name} with thread ID: ${workerMetadata.threadId}`
                );
            } else {
                console.log(
                    `There was an error while running a worker ${workerMetadata.name}`
                );
                console.error(error);
            }
        },
    });

    await cron.start();
};

createGoalUpdateJobs();
