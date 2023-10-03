import { PrismaClient } from '@prisma/client';
import path from 'path';
import ms from 'ms';
import Bree from 'bree';

// launch wednesday at midnight, set to run every week same time.
const prisma = new PrismaClient();

// clean up the prisma fixture database.
await prisma.fixtures.deleteMany();

// initialize the data variable to store EPL data.
let data;

// Query for data, handle the promise
try {
    const res = await fetch(
        `https://fantasy.premierleague.com/api/fixtures?future=1`
    );
    data = await res.json();
} catch (err) {
    console.log(err);
}

// get the gameweekId
const gameWeekId = data[0].event;

// set up the array to hold the gameweek information
const kickoffTimes = [];

// get the length of the array that holds games in that game week. This will help us reduce our processing load.
let numberOfFixtures = 0;

// remove duplicate kickoff times, count fixtures, populate kickoffTimes array. 
for (const id in data) {
    if (
        data[id].event === gameWeekId &&
        kickoffTimes.indexOf(data[id].kickoff_time) < 0
    ) {
        kickoffTimes.push(data[id].kickoff_time);
        numberOfFixtures = ++numberOfFixtures;
    } else {
        if (kickoffTimes.indexOf(data[id].kickoff_time) > -1) {
            numberOfFixtures = ++numberOfFixtures;
        }
    }
}

console.log(kickoffTimes);
console.log(numberOfFixtures);

const appDir = '/Users/bigviking/Documents/GitHub/Projects/blackjack/server/';

let newCronJobs = [];

kickoffTimes.forEach((kickoffTime) => {
    newCronJobs.push({
        name: `gw-worker-${kickoffTime}`,
        path: path.join(appDir + '/jobs', 'goalUpdate.js'),
        interval: '2s',
        closeWorkerAfterMs: ms('180m'),
        worker: {
            workerData: {
                kickoff_time: kickoffTime, 
                numberOfFixtures: numberOfFixtures,
            },
        },
    });
});

const cron = new Bree({
    root: false,
    jobs: newCronJobs,
    errorHandler: (error, workerMetaData) => {
        console.log(error);
    },
});

cron.start();
