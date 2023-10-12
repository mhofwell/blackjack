import Bree from 'bree';
import Graceful from '@ladjs/graceful';
import jobs from './index.js';

export default async function cronStart() {
    const cron = new Bree({
        jobs: jobs,
    });

    // handle graceful reloads, pm2 support, and events like SIGHUP, SIGINT, etc.
    const graceful = new Graceful({ brees: [cron] });
    graceful.listen();

    // start all jobs
    cron.start();
}

