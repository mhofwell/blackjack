const jobs = [
    {
        name: 'get-fixtures',
        cron: '45 13 * * 6',
        // timeout: '5s',
    },
    {
        name: 'create-player-jobs',
        cron: '47 13 * * 6',
        // timeout: '15s',
    },
];

export default jobs;
