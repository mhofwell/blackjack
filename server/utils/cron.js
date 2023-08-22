import cron from 'node-cron';

// EPL cron job to pull player data.
cron.schedule(
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