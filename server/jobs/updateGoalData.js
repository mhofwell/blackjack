import getUpcomingPlayers from '../utils/data/getUpcomingPlayers.js';
import { parentPort } from 'worker_threads';

const kickoffTime = new Date('2023-10-07T11:30:00Z').toString();
console.log('kickoffTime ', kickoffTime);

const numberOfFixtures = 5;
const gameWeekId = 8;

const players = await getUpcomingPlayers(kickoffTime, numberOfFixtures);

let newData = {};
let updatePrisma = false;
let c = 0;
let i = 0;
// const { kickoffTime, numberOfFixtures, gameWeekId } = workerData;

const updateGoalData = async () => {
    setInterval(async () => {
        console.log('iteration 1');
        i++;

        try {
            const res = await fetch(
                //// CHANGE THIS TO gameWeekId //// !!!!! //// !!!!!!!!!
                `https://fantasy.premierleague.com/api/event/${
                    gameWeekId - 1
                }/live/`
            );

            if (!res) {
                throw new Error(
                    '---------> Cannot fetch gameweek live data from EPL API, check connection.'
                );
            }
            parentPort.postMessage(
                `--------->  Gameweek live data fetched for week ${gameWeekId}`
            );
            // console.log(
            //     `---------> Gameweek live data fetched for week ${gameWeekId}`
            // );

            const data = await res.json();

            for (const player of players) {
                // console.log(
                //     `---------> Fetching player live data for player id ${player.id}`
                // );
                parentPort.postMessage(
                    `---------> Fetching player live data for player id ${player.id}`
                );

                const playerObject = data.elements[player.id - 1];
                console.log('Fetched player is: ', playerObject);

                if (playerObject.stats.goals_scored !== 0) {
                    newData.goals =
                        player.goals + playerObject.stats.goals_scored;
                }
                if (playerObject.stats.own_goals !== 0) {
                    newData.own_goals =
                        player.own_goals + playerObject.stats.own_goals;
                }

                newData.goals > 0 || newData.own_goals > 0
                    ? updatePrisma === true
                    : updatePrisma === false;

                c++;
                console.log('c', c);

                if (updatePrisma) {
                    console.log('New player data object to save: ', newData);
                    parentPort.postMessage(
                        'New player data object to save: ',
                        newData
                    );
                    const updatedPlayer = await prisma.player.update({
                        where: {
                            id: player.id,
                        },
                        data: newData,
                    });
                    console.log(`Updated! ${updatedPlayer}`);
                    parentPort.postMessage(`Updated! ${updatedPlayer}`);
                } else {
                    console.log('No new player object to save: ', newData);
                    parentPort.postMessage(
                        'No new player object to save: ',
                        newData
                    );
                }
                console.log(`Iteration complete for player ${player.id}`);
                parentPort.postMessage(
                    `Iteration complete for player ${player.id}`
                );
            }
        } catch (err) {
            // parentPort.postMessage(
            //     'Worker: ',
            //     workerData.kickoff_time,
            //     'Iteration: ',
            //     i
            // );
            if (parentPort) {
                parentPort.postMessage('---------> Something went wrong...');
                parentPort.postMessage(err);
                process.exit(1);
            } else {
                console.log('---------> Something went wrong...');
                console.error(err);
                process.exit(1);
            }
        }

        if (i === 1) {
            if (parentPort) {
                parentPort.postMessage('---------> Process complete...');
                parentPort.postMessage('done');
                process.exit(0);
            } else {
                console.log('---------> Process complete...');
                console.log('done');
                process.exit(0);
            }
        }
    }, 1000);
};

updateGoalData();

// iterate for the whole match time and then save after the iterations are done if changes are needed to be saved. !!!!
