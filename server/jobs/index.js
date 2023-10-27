const jobs = [
    {
        name: 'get-fixtures',
        // cron: '00 0 * * 4',
        timeout: '5s',
    },
    {
        name: 'create-player-jobs',
        // cron: '30 0 * * 4',
        timeout: '15s',
    },
];

export default jobs;
