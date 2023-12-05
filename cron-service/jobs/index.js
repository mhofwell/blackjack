const jobs = [
    {
        name: 'get-fixtures',
        // cron: '00 16 * * 5',
        timeout: '3s',
    },
    {
        name: 'create-player-jobs',
        // cron: '02 16 * * 5',
        timeout: '132s',
    },
];

module.exports = jobs;
