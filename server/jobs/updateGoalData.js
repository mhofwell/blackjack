import { getRedisJSON, setRedisJSON } from '../utils/redis/json.js';
import fetchGQL from '../utils/graphql/fetch.js';
import PLAYER_KEY from '../utils/redis/keys/index.js';
import { workerData, parentPort } from 'worker_threads';

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
    let { kickoffTime, numberOfFixtures, gameWeekId } = workerData;

    const data = {
        input: {
            kickoffTime: new Date(kickoffTime).toString(),
            numberOfFixtures,
        },
    };

    const query = `query GetGameweekPlayers($input: getGameweekPlayers) {
        getGameweekPlayers(input: $input) {
          id
          goals
          own_goals
          net_goals
        }
      }`;

    const res = await fetchGQL(query, data);

    let players = res.getGameweekPlayers;

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
                throw new Error('Cannot fetch data from EPL API.');
            }

            const data = await res.json();

            console.log(`Job ${kickoffTime}: All active players fetched.`);

            for (const player of players) {
                let isNew;

                console.log(
                    `${kickoffTime} -------> Evaluating player: `,
                    player
                );

                const livePlayerIndex = data.elements.findIndex(
                    (element) => element.id === player.id
                );

                console.log(
                    `${kickoffTime} -------> Player index in EPL data found`
                );

                const livePlayerData = data.elements[livePlayerIndex].stats;

                console.log(
                    `${kickoffTime} -------> Live player data fetched for: ${player.id}`,
                    livePlayerData
                );

                const cachedPlayerData = await getRedisJSON(
                    PLAYER_KEY,
                    data.elements[livePlayerIndex].id
                );

                if (!cachedPlayerData) {
                    console.log(`${kickoffTime} -------> No redis data found.`);

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
                } else {
                    console.log(
                        `${kickoffTime} -------> Cached player found in redis: `,
                        cachedPlayerData
                    );

                    isNew = false;

                    goalDiff =
                        livePlayerData.goals_scored - cachedPlayerData.goals;

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

                    livePlayerData.goals_scored - cachedPlayerData.goals > 0 ||
                    livePlayerData.own_goals - cachedPlayerData.own_goals > 0
                        ? (updatePrisma = true)
                        : (updatePrisma = false);
                }
                console.log(
                    `${kickoffTime} -------> Saved player into cache: `,
                    player
                );

                if (updatePrisma) {
                    if (isNew) {
                        goalDiff = livePlayerData.goals_scored;
                        ownGoalDiff = livePlayerData.own_goals;
                        netGoalDiff = goalDiff - ownGoalDiff;
                    }

                    player.net_goals =
                        player.goals - player.own_goals + player.net_goals;

                    console.log(
                        `${kickoffTime} -------> New player data object to save: ${player.id}`
                    );

                    const updatePlayerQuery = `mutation Mutation($input: updatePlayerInput!) {
                        updatePlayer(input: $input) {
                            id
                            goals
                            own_goals
                            net_goals
                        }
                    }`;

                    const updatedPlayerInput = {
                        input: player,
                    };

                    const updatedPlayer = await fetchGQL(
                        updatePlayerQuery,
                        updatedPlayerInput
                    );

                    console.log(
                        `${kickoffTime} -------> Updated player: ${updatedPlayer}`
                    );

                    const entryQuery = `query PlayerEntries($id: ID!) {
                            playerEntries(id: $id) {
                                id
                                goals
                                own_goals
                                net_goals
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

                    console.log(
                        'Queried entries successfully: ',
                        iteratableEntries
                    );

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

                        console.log(
                            `${kickoffTime} -------> Entry updated, `,
                            updatedEntry
                        );
                    }
                } else {
                    console.log(
                        `${kickoffTime} -------> No changes in player goals.`
                    );
                }
                console.log(
                    `${kickoffTime} -------> Iteration complete for player ${player.id}`
                );
            }
        } catch (err) {
            if (parentPort) {
                parentPort.postMessage('Something went wrong...');
                parentPort.postMessage(err);
                process.exit(1);
            } else {
                console.log('Something went wrong...');
                console.error(err);
                process.exit(1);
            }
        }
        if (i === 2) {
            if (parentPort) {
                parentPort.postMessage('Process complete...');
                parentPort.postMessage('done');
            } else {
                console.log('Process complete...');
                console.log('done');
                process.exit(0);
            }
        }
    }, 1000);
};

updateGoalData();

// iterate for the whole match time and then save after the iterations are done if changes are needed to be saved. !!!!
