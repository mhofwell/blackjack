import { parentPort } from 'worker_threads';
import { getRedisJSON, setRedisJSON } from '../utils/redis/json.js';
import fetchGQL from '../utils/graphql/fetch.js';
import PLAYER_KEY from '../utils/redis/keys/index.js';
import { workerData } from 'worker_threads';

let { kickoffTime, numberOfFixtures, gameWeekId } = workerData;

const data = {
    input: {
        kickoffTime: new Date(kickoffTime).toString(),
        numberOfFixtures,
    },
};

const query = ` query GetGameweekPlayers($input: getGameweekPlayers) {
        getGameweekPlayers(input: $input) {
          id
          net_goals
          own_goals
          goals
        }
      }`;

const res = await fetchGQL(query, data);

let players = res.getGameweekPlayers;

console.log('Worker: ', kickoffTime, 'Players: ', players);

//////////////////////// TEST BELOW

// const gameWeekId = 9;
// const kickoffTime = new Date('2023-10-21T14:00:00Z').toString();
// console.log('kickoffTime ', kickoffTime);
// const numberOfFixtures = 5;

// const players = [
//     { id: 353, goals: 0, net_goals: 0, own_goals: 0 },
//     { id: 354, goals: 0, net_goals: 0, own_goals: 0 },
//     { id: 368, goals: 0, net_goals: 0, own_goals: 0 },
//     { id: 616, goals: 1, net_goals: 2, own_goals: 0 },
// ];

// const livePlayerData = [
//     { id: 353, stats: { goals_scored: 2, net_goals: 0, own_goals: 0 } },
//     { id: 354, stats: { goals_scored: 0, net_goals: 0, own_goals: 1 } },
//     { id: 368, stats: { goals_scored: 0, net_goals: 0, own_goals: 0 } },
//     { id: 616, stats: { goals_scored: 1, net_goals: 0, own_goals: 0 } },
// ];

// const result = [
//     { id: 353, goals: 2, net_goals: 0, own_goals: 0 },
//     { id: 354, goals: 0, net_goals: -1, own_goals: 1 },
//     { id: 368, goals: 0, net_goals: 0, own_goals: 0 },
//     { id: 616, goals: 2, net_goals: 2, own_goals: 0 },
// ];

const updateGoalData = async () => {
    let goalDiff;
    let ownGoalDiff;
    let netGoalDiff;
    let updatePrisma = false;
    let i = 0;

    setInterval(async () => {
        i++;
        console.log(`iteration: ${i}`);

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
                `---------> Worker ${workerData.kickoffTime}: Gameweek live data fetched for week ${gameWeekId}`
            );

            const data = await res.json();

            for (const player of players) {
                let isNew;
                // parentPort.postMessage(
                //     `--------->  Fetching player from DB ${player.id}`
                // );

                console.log(
                    '--------->  Retrieved next active player:',
                    player
                );

                console.log(
                    `--------->  Fetching player id from live data: ${player.id}`
                );
                const livePlayerIndex = data.elements.findIndex(
                    (element) => element.id === player.id
                );

                const livePlayerData = data.elements[livePlayerIndex].stats;

                console.log('Live data from EPL API: ', livePlayerData);

                console.log(
                    '---------> Fetching player from redis cache:',
                    player.id
                );

                const cachedPlayerData = await getRedisJSON(
                    PLAYER_KEY,
                    data.elements[livePlayerIndex].id
                );

                if (!cachedPlayerData) {
                    console.log('No cached data found.');
                    isNew = true;

                    livePlayerData.goals_scored > 0
                        ? (player.goals =
                              player.goals + livePlayerData.goals_scored)
                        : (player.goals = player.goals);

                    livePlayerData.own_goals > 0
                        ? (player.own_goals =
                              player.own_goals + livePlayerData.own_goals)
                        : (player.own_goals = player.own_goals);

                    livePlayerData.goals_scored > 0 ||
                    livePlayerData.own_goals > 0
                        ? (updatePrisma = true)
                        : (updatePrisma = false);
                    await setRedisJSON(PLAYER_KEY, player.id, player);

                    console.log('Saved new player into cache: ', player);
                } else {
                    console.log('Cached player found:', cachedPlayerData);
                    isNew = false;

                    goalDiff =
                        livePlayerData.goals_scored - cachedPlayerData.goals;
                    console.log('goalDiff: ', goalDiff);

                    livePlayerData.goals_scored > cachedPlayerData.goals
                        ? (player.goals =
                              livePlayerData.goals_scored -
                              cachedPlayerData.goals)
                        : (player.goals = player.goals);

                    ownGoalDiff =
                        livePlayerData.own_goals - cachedPlayerData.own_goals;

                    livePlayerData.own_goals > cachedPlayerData.own_goals
                        ? (player.own_goals =
                              livePlayerData.own_goals -
                              cachedPlayerData.own_goals)
                        : (player.own_goals = player.own_goals);

                    netGoalDiff = goalDiff - ownGoalDiff;

                    console.log('Updated cached player data: ', player);

                    livePlayerData.goals_scored - cachedPlayerData.goals > 0 ||
                    livePlayerData.own_goals - cachedPlayerData.own_goals > 0
                        ? (updatePrisma = true)
                        : (updatePrisma = false);

                    console.log(updatePrisma);

                    console.log(
                        '---------> Finished analyzing goal data for player: ',
                        player.id
                    );
                }
                if (updatePrisma) {
                    // parentPort.postMessage('New player data object to save: ', goalData);

                    if (isNew) {
                        goalDiff = livePlayerData.goals_scored;
                        ownGoalDiff = livePlayerData.own_goals;
                        netGoalDiff = goalDiff - ownGoalDiff;
                    }

                    player.net_goals =
                        player.goals - player.own_goals + player.net_goals;

                    console.log(
                        '---------> New player data object to save: ',
                        player
                    );

                    const updatePlayerQuery = `mutation Mutation($input: updatePlayerInput!) {
                        updatePlayer(input: $input) {
                          goals
                          id
                          net_goals
                          own_goals
                        }
                      }`;

                    const updatedPlayerInput = {
                        input: player,
                    };

                    const updatedPlayer = await fetchGQL(
                        updatePlayerQuery,
                        updatedPlayerInput
                    );

                    console.log('---------> Updated player ', updatedPlayer);
                    // parentPort.postMessage(`Updated! ${updatedPlayer}`);

                    console.log('---------> New entry data to save.');
                    // parentPort.postMessage('New player data object to save: ', goalData);

                    const entryQuery = `query PlayerEntries($id: ID!) {
                        playerEntries(id: $id) {
                          id
                          net_goals
                          own_goals
                          goals
                        }
                      }`;

                    const entryQueryVariables = {
                        id: player.id,
                    };

                    const dbEntries = await fetchGQL(
                        entryQuery,
                        entryQueryVariables
                    );

                    const iteratableEntries = dbEntries.playerEntries;

                    console.log('---------> Queried entries successfully.');

                    for (const entry of iteratableEntries) {
                        console.log('Entry', entry);
                        const input = {
                            id: entry.id,
                            goals: entry.goals + goalDiff,
                            own_goals: entry.own_goals + ownGoalDiff,
                            net_goals: entry.net_goals + netGoalDiff,
                        };
                        const updateEntryInput = {
                            input,
                        };

                        const updateEntry = `mutation Mutation($input: updateEntryInput!) {
                                    updateEntry(input: $input) {
                                      id
                                      goals
                                      own_goals
                                      net_goals
                                    }
                                }`;

                        const updatedEntry = await fetchGQL(
                            updateEntry,
                            updateEntryInput
                        );

                        console.log('---------> Entry updated: ', updatedEntry);
                    }
                } else {
                    console.log('---------> No changes in player goals.');
                    // parentPort.postMessage('No changes in player goals.');
                }
                console.log(
                    `---------> Iteration complete for player ${player.id}`
                );
                // parentPort.postMessage(`Iteration complete for player ${player.id}`);
            }
        } catch (err) {
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
        if (i === 2) {
            if (parentPort) {
                parentPort.postMessage('---------> Process complete...');
                parentPort.postMessage('done');
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
