const jobs = [
    {
        name: 'get-fixtures',
        cron: '10 16 * * 4',
        // timeout: '5s',
    },
    {
        name: 'create-player-jobs',
        cron: '12 16 * * 4',
        // timeout: '15s',
    },
];

export default jobs;
