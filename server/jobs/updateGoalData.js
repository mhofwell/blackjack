import getUpcomingPlayers from '../utils/data/getUpcomingPlayers.js';
import { parentPort } from 'worker_threads';

const updateGoalData = async () => {
    // const { kickoffTime, numberOfFixtures, gameWeekId } = workerData;

    const kickoffTime = new Date('2023-10-07T11:30:00Z').toString();
    console.log('kickoffTime ', kickoffTime);

    const numberOfFixtures = 5;
    const gameWeekId = 8;

    const players = await getUpcomingPlayers(kickoffTime, numberOfFixtures);

    let newData = {};
    let updatePrisma = false;

    let i = 0;

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
            // parentPort.postMessage(
            //     `--------->  Gameweek live data fetched for week ${gameWeekId}`
            // );
            console.log(
                `---------> Gameweek live data fetched for week ${gameWeekId}`
            );

            const data = await res.json();

            for (const n in players) {
                console.log(
                    `---------> Fetching player live data for player id ${players[n].id}`
                );

                const playerObject = data.elements[players[n].id - 1];
                console.log('Fetched player is: ', playerObject);

                if (playerObject.stats.goals_scored !== 0) {
                    newData.goals =
                        players[n].goals + playerObject.stats.goals_scored;
                }
                if (playerObject.stats.own_goals !== 0) {
                    newData.own_goals =
                        players[n].own_goals + playerObject.stats.own_goals;
                }

                newData.goals > 0 || newData.own_goals > 0
                    ? updatePrisma === true
                    : updatePrisma === false;

                if (updatePrisma) {
                    console.log('New player data object to save: ', newData);
                    const updatedPlayer = await prisma.player.update({
                        where: {
                            id: player.id,
                        },
                        data: newData,
                    });
                    console.log(`Updated! ${updatedPlayer}`);
                } else {
                    console.log('No new player object to save: ', newData);
                }
                console.log(`Iteration complete for player ${players[n].id}`);
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
