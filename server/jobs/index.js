const jobs = [
    {
        name: 'get-fixtures',
        // cron: '00 0 * * 4',
        interval: '20s',
        timeout: '0s',
    },
    {
        name: 'create-player-jobs',
        // cron: '30 0 * * 4',
        interval: '10s',
    },
];

export default jobs;
