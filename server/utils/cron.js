import cron from 'node-cron';

// EPL cron job to pull gameweek data every Sunday.

const gameweekCron = cron.schedule(
    '*/15 * * * * *',
    function () {
        console.log('---------------------');
        console.log('running a task every 15 seconds');
    },
    {
        scheduled: false,
        timezone: '"America/Vancouver"',
    }
);

// cron job to update player information every two minutes during a game for a 3 hour period

const goalUpdateCron = cron.schedule(
    '*/15 * * * * *',
    function () {
        console.log('---------------------');
        console.log('running a task every 15 seconds');
    },
    {
        scheduled: false,
        timezone: '"America/Vancouver"',
    }
);

export { gameweekCron, goalUpdateCron };
