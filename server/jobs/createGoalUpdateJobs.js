import path from 'path';
import Bree from 'bree';
import { PrismaClient } from '@prisma/client';

const createGoalUpdateJobs = async () => {
    const prisma = new PrismaClient();

    const fixture = await prisma.fixtures.findFirst();
    const appDir =
        '/Users/bigviking/Documents/GitHub/Projects/blackjack/server/';

    console.log(fixture);

    let newCronJobs = [];

    // fixtures.forEach((fixture) => {
    newCronJobs.push({
        name: `gw-worker-${fixture.kickoff_time}`,
        path: path.join(appDir + '/jobs', 'updateGoalData.js'),
        interval: '20s',
        timeout: 0,
        outputWorkerMetadata: true,
        worker: {
            workerData: {
                kickoffTime: fixture.kickoff_time,
                numberOfFixtures: fixture.number_of_fixtures,
                gameWeekId: fixture.game_week_id,
            },
        },
    });
    return newCronJobs;
    // });
};

const workerMessageHAndler = (worker) => {
    let threadId = cron.getWorkerMetadata(worker.name).worker.threadId;
    setTimeout(() => {
        console.log(
            `Id: ${threadId}, Name: ${worker.name}, Message: ${worker.message}`
        );
    }, 1000);
};

const cronJobs = await createGoalUpdateJobs();
console.log(cronJobs);

const cron = new Bree({
    root: false,
    jobs: cronJobs,
    outputWorkerMetadata: true,
    workerMessageHandler: workerMessageHAndler,
    errorHandler: (error, workerMetadata) => {
        // workerMetadata will be populated with extended worker information only if
        // Bree instance is initialized with parameter `workerMetadata: true
        if (workerMetadata.threadId) {
            console.log(
                `There was an error while running a worker ${workerMetadata.name} with thread ID: ${workerMetadata.threadId}`
            );
        } else {
            console.log(
                `There was an error while running a worker ${workerMetadata.name}`
            );
        }
        console.error(error);
        // errorService.captureException(error);
    },
});

(async () => {
    await cron.start();
})();
