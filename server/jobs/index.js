const jobs = [
    {
        name: 'get-fixtures',
        cron: '05 16 * * 4',
        // timeout: '5s',
    },
    {
        name: 'create-player-jobs',
        cron: '07 16 * * 4',
        // timeout: '15s',
    },
];

export default jobs;
