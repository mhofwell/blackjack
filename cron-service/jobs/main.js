const Bree = require('bree');
const Graceful = require('@ladjs/graceful');

// all jobs
const jobs = require('./index.js');

// logging
const getLogger = require('../logging/logger.js');

const logger = getLogger('worker');

async function workerMessageHandler(message) {
    setTimeout(() => {
        logger.info(`${message.name} > ${message.message}`);
    }, 500);
}

const startGameweekUpdates = async () => {
    logger.info('Starting weekly cron jobs...');
    const cron = new Bree({
        logger: logger,
        jobs: jobs,
        outputWorkerMetadata: false,
        removeCompleted: true,
        workerMetadata: true,
        workerMessageHandler: workerMessageHandler,
        errorHandler: (error, workerMetadata) => {
            // workerMetadata will be populated with extended worker information only if
            // Bree instance is initialized with parameter `workerMetadata: true
            if (workerMetadata.threadId) {
                logger.info(
                    `There was an error while running a worker ${workerMetadata.name} with thread ID: ${workerMetadata.threadId}`
                );
            } else {
                logger.info(
                    `There was an error while running worker [ ${workerMetadata.name} ]`
                );
            }
            logger.error(error);
        },
    });

    const graceful = new Graceful({
        brees: [cron],
        logger: logger,
        hideMeta: false,
    });

    graceful.listen();

    cron.start();
};

module.exports = startGameweekUpdates;
