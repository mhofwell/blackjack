const jobs = [
    {
        name: 'get-fixtures',
        cron: '0 15 * * 4',
        // timeout: '5s',
    },
    {
        name: 'create-player-jobs',
        cron: '5 15 * * 4',
        // timeout: '15s',
    },
];

export default jobs;
