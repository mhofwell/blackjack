import { parentPort, workerData } from 'worker_threads';
import { PrismaClient } from '@prisma/client';

const updateGoalData = async () => {
    const prisma = new PrismaClient();
    const { kickoffTime, numberOfFixtures } = workerData;

    try {
        const res = await fetch(
            'https://fantasy.premierleague.com/api/fixtures?future=1'
        );

        if (!res) {
            throw new Error(
                '----> Cannot fetch from EPL API, check connection.'
            );
        }

        const data = await res.json();
        const weeklyFixtures = data.slice(0, numberOfFixtures - 1);

        let teamIdArray = [];

        weeklyFixtures.forEach((fixture) => {
            if (fixture.kickoff_time === kickoffTime) {
                teamIdArray.push[team_a];
                teamIdArray.push[team_h];
            }
        });

        let players = [];

        for (const id in teamIdArray) {
            const p = prisma.player.findMany({
                where: {
                    club_id: teamIdArray[id],
                },
                select: {
                    goals: true,
                    net_goals: true,
                    own_goals: true,
                },
            });
            if (!p) {
                throw new Error('----> Cannot save player data to PRISMA');
            }
            players.push(p);
            parentPort.postMessage(
                `----> Players fetched for club ${teamIdArray[id]}`
            );
        }

        for (const player in players) {
            parentPort.postMessage(
                `----> Fetching player live data for player ${player}`
            );
            const res = await fetch(
                `https://fantasy.premierleague.com/api/event/${player}/live/`
            );

            if (!res) {
                throw new Error(
                    '----> Cannot fetch from EPL API, check connection.'
                );
            }

            if (goals === goals ) {

            } 
            
            if (own_goals === own_goals) {

            }

        }

        let i = 0;
        setInterval(() => {
            i++;
            parentPort.postMessage(
                'Worker: ',
                workerData.kickoff_time,
                'Iteration: ',
                i
            );

            if (i === 3) {
                if (parentPort) parentPort.postMessage('done');
                else process.exit(0);
            }
        }, 1000);
    } catch (err) {
        if (parentPort) {
            parentPort.postMessage('----> Error fetching data from EPL...');
            parentPort.postMessage(err);
            process.exit(1);
        } else {
            console.log('----> Error fetching data from EPL...');
            console.error(err);
            process.exit(1);
        }
    }

    // query prisma and find the players from those teams.

    // for each player query the EPL API and get the goals, own_goals

    // update the players and their goals in the db
};

updateGoalData();
