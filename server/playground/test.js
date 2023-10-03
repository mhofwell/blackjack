import Bree from 'bree';
import Graceful from '@ladjs/graceful';
import jobList from '../jobs/index.js';
// import Cabin from 'cabin';
// import { Signale } from 'signale';
// import Axe from 'axe';

const cron = new Bree({
    jobList,
});

// handle graceful reloads, pm2 support, and events like SIGHUP, SIGINT, etc.
const graceful = new Graceful({ brees: [cron] });
graceful.listen();

// start all jobs
cron.start();

export default cron;
