const jobs = [
    {
        name: 'getWeeklyFixtures',
        interval: 'every wednesday at midnight',
        timeout: 0,
    },
    {
        name: 'createGoalUpdateJobs',
        interval: 'every thursday at 12:30 am',
        timeout: 5000,
    },
];

export default jobs;
