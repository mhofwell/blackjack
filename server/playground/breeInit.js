import Bree from 'bree';
import Graceful from '@ladjs/graceful';

const cron = new Bree({
    jobs: [
        {
            name: 'getWeeklyFixtures',
            interval: '20s',
            timeout: 0,
        },
        {
            name: 'cronFactory',
            interval: '25s',
        },
    ],
});

// handle graceful reloads, pm2 support, and events like SIGHUP, SIGINT, etc.
const graceful = new Graceful({ brees: [cron] });
graceful.listen();

// start all jobs
cron.start();
