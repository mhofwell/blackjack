import getLogger from '../logging/logger.js';

const logger = getLogger('express');

async function healthcheck() {
    logger.info('Checking API health.');
    try {
        const data = await fetch('http://localhost:8080/health');

        if (!data) {
            logger.info('API not ready.');
            process.exit(1);
        }

        if (data.status === 200) {
            logger.info(`API is ready with status ${data.status}.`);
            process.exit(0);
        } else {
            throw new Error('API is not ready.');
        }
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
}

healthcheck();
