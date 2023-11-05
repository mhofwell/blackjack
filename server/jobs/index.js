const jobs = [
    {
        name: 'get-fixtures',
        cron: '7 7 * * 0',
        // timeout: '5s',
    },
    {
        name: 'create-player-jobs',
        cron: '9 7 * * 0',
        // timeout: '15s',
    },
];

export default jobs;
