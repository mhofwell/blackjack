import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import ms from 'ms';
import { parentPort } from 'worker_threads';
import fs from 'fs';
import Bree from 'bree';

const gameweekUpdate = async () => {
    // launch wednesday at midnight, set to run every week same time.
    const prisma = new PrismaClient();
    await prisma.fixtures.deleteMany();

    try {
        const res = await fetch(
            `https://fantasy.premierleague.com/api/fixtures?future=1`
        );

        const data = await res.json();
        const gameWeekId = data[0].event;

        // set up the array to hold the gameweek information
        const nextGameweekKickoffTimes = [];

        // get the length of the array that holds games in that game week. This will help us reduce our processing load.
        let numberOfGames = 0;

        // remove duplicate kickoff times
        for (const id in data) {
            if (
                data[id].event === gameWeekId &&
                nextGameweekKickoffTimes.indexOf(data[id].kickoff_time) < 0
            ) {
                nextGameweekKickoffTimes.push(data[id].kickoff_time);
                numberOfGames = ++numberOfGames;
            } else {
                if (
                    nextGameweekKickoffTimes.indexOf(data[id].kickoff_time) > -1
                ) {
                    numberOfGames = ++numberOfGames;
                }
            }
        }

        console.log(nextGameweekKickoffTimes);

        let gameweekCronJobInfo = [];

        nextGameweekKickoffTimes.forEach((kickoffTime) => {
            const ms_kickoff_time = Date.parse(kickoffTime);

            const entry = {
                game_week_id: gameWeekId,
                number_of_fixtures: numberOfGames,
                kickoff_time: kickoffTime,
                ms_kickoff_time: ms_kickoff_time,
            };
            gameweekCronJobInfo.push(entry);
        });

        const count = await prisma.fixtures.createMany({
            data: gameweekCronJobInfo,
        });

        console.log(count);
        prisma.$disconnect();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }

    process.exit(0);
};

gameweekUpdate();

// parentPort.postMessage('Working on goal update jobs');
// let goalUpdateJobs = [];
// // create new cron jobs to run and place them into the jobList
// nextGameweekKickoffTimes.forEach((kickoffTime) => {
//     const d = Date.now() + 5000;
//     parentPort.postMessage('Iterating over nextGameweekKickoffTimes');
//     const newJobData = {
//         name: `${kickoffTime}`,
//         path: '/Users/bigviking/Documents/GitHub/Projects/blackjack/server/jobs/goalUpdate.js',
//         // date: dayjs(kickoffTime),
//         // date: d,
//         interval: 'every 2 seconds',
//         closeWorkerAfterMs: ms('180m'),
//         worker: {
//             workerData: {
//                 kickoffTime: kickoffTime,
//                 length: numberOfGames,
//             },
//         },
//         outputWorkerMetadata: true,
//     };
//     parentPort.postMessage('Pushing job into goalUpdateJobs');
//     goalUpdateJobs.push(newJobData);
// });

// const cron = new Bree({
//     goalUpdateJobs,
// });

// cron.start();
