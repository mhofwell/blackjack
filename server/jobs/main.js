import Bree from 'bree';
import Graceful from '@ladjs/graceful';

// all jobs
import jobs from './index.js';

// logging
// import getLogger from '../logging/logger.js';
// const logger = getLogger('worker');

const cronStart = async () => {
    console.log('Starting Bree cron jobs.');
    const cron = new Bree({
        // logger: logger,
        jobs: jobs,
    });

    const graceful = new Graceful({ brees: [cron] });
    graceful.listen();

    cron.start();
};

cronStart();
