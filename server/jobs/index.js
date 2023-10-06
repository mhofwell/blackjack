const jobs = [
    {
        name: 'getWeeklyFixtures',
        // cron: '0 0 * * WED',
        interval: '30s',
        timeout: 0,
    },
    {
        name: 'createGoalUpdateJobs',
        // interval: 'Thursday at 12:30 am',
        // cron: '0 0 * * WED'
        interval: '15s',
    },
];

export default jobs;
