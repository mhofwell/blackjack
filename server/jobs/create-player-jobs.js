import path from 'path';
import Bree from 'bree';
import prisma from '../prisma/client.js';
import { parentPort } from 'worker_threads';
import dayjs from 'dayjs';

import getLogger from '../logging/logger.js';
const logger = getLogger('worker');

const createGoalUpdateJobs = async () => {
    const fixtures = await prisma.fixtures.findMany();

    if (fixtures.length < 0) {
        throw new Error('No fixtures found.');
    }

    if (parentPort) {
        parentPort.postMessage(
            'Worker started to create goal update jobs...👷'
        );
    } else {
        logger.info('Worker started to create goal update jobs...👷');
    }

    const appDir =
        '/Users/bigviking/Documents/GitHub/Projects/blackjack/server/';

    let newCronJobs = [];
    // could you return this forEach into a variable? Maybe use .map instead.
    fixtures.forEach((fixture) => {
        newCronJobs.push({
            name: `gw-worker-${fixture.kickoff_time}`,
            path: path.join(appDir + '/jobs', 'update-player-data.js'),
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
        // you don't have to return this value here. Edit for next.
        return newCronJobs;
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
            // workerMetadata will be populated with extended worker information only if
            // Bree instance is initialized with parameter `workerMetadata: true
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
