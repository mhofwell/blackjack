const jobs = [
    {
        name: 'get-fixtures',
        // cron: '0 0 * * WED',
        interval: '30s',
        timeout: 0,
    },
    {
        name: 'create-player-jobs',
        // interval: 'Thursday at 12:30 am',
        // cron: '0 0 * * WED'
        interval: '15s',
    },
];

export default jobs;
