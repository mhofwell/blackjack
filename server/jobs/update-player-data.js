import { getRedisJSON, setRedisJSON } from '../utils/redis/json.js';
import fetchGQL from '../utils/graphql/fetch.js';
import PLAYER_KEY from '../utils/redis/keys/index.js';
import { workerData, parentPort } from 'worker_threads';

const updateGoalData = async () => {
    let { kickoffTime, numberOfFixtures, gameWeekId } = workerData;

    const queryData = {
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

    const res = await fetchGQL(query, queryData);

    let players = res.getGameweekPlayers;

    let goalDiff;
    let ownGoalDiff;
    let netGoalDiff;
    let updatePrisma = false;
    let i = 0;

    setInterval(async () => {
        i++;

        console.log(`${kickoffTime} > Iteration: ${i}`);

        try {
            const res = await fetch(
                //// CHANGE THIS TO gameWeekId //// !!!!! //// !!!!!!!!!
                `https://fantasy.premierleague.com/api/event/${
                    gameWeekId - 1
                }/live/`
            );

            if (!res === 0) {
                throw new Error('Cannot fetch data from EPL API.');
            }

            const data = await res.json();

            if (data.elements.length === 0) {
                console.log(`EPL gameweek has not started yet.`);
                if (parentPort) {
                    parentPort.postMessage(
                        `Gameweek ${gameWeekId} has not started yet!`
                    );
                    parentPort.postMessage('done');
                    process.exit(0);
                } else {
                    console.log(`Gameweek ${gameWeekId} has not started yet!`);
                    process.exit(0);
                }
            }
            console.log(`${kickoffTime} > All live players fetched.`);

            for (const player of players) {
                let isNew;
                console.log(
                    `${kickoffTime}: ${player.id} -------> Player from DB: `,
                    player
                );

                const livePlayerIndex = data.elements.findIndex(
                    // identify the element index [0] ? this is the error
                    (element) => element.id === player.id
                );

                if (livePlayerIndex >= 0) {
                    console.log(
                        `${kickoffTime}: ${player.id} > Player in EPL data found: `,
                        data.elements[livePlayerIndex].stats
                    );
                } else {
                    console.log(
                        `${kickoffTime}: ${player.id} > Player in EPL data not found.`
                    );
                    process.exit(1);
                }

                const livePlayerData = data.elements[livePlayerIndex].stats;

                const cachedPlayerData = await getRedisJSON(
                    PLAYER_KEY,
                    data.elements[livePlayerIndex].id
                );

                if (!cachedPlayerData) {
                    console.log(
                        `${kickoffTime}: ${player.id} > No redis data found.`
                    );

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

                    const newRedisData = {
                        id: data.elements[livePlayerIndex].id,
                        goals: livePlayerData.goals_scored,
                        own_goals: livePlayerData.own_goals,
                        net_goals:
                            livePlayerData.goals_scored -
                            livePlayerData.own_goals,
                    };

                    console.log(
                        `${kickoffTime}: ${player.id} > New redis data to save:`,
                        newRedisData
                    );

                    await setRedisJSON(PLAYER_KEY, player.id, newRedisData);
                    console.log(
                        `${kickoffTime}: ${player.id} > Saved new player in redis:`,
                        newRedisData
                    );
                } else {
                    console.log(
                        `${kickoffTime}: ${player.id} > Cached player found in redis: `,
                        cachedPlayerData
                    );

                    isNew = false;

                    if (
                        livePlayerData.goals_scored - cachedPlayerData.goals >
                            0 ||
                        livePlayerData.own_goals - cachedPlayerData.own_goals >
                            0
                    ) {
                        goalDiff =
                            livePlayerData.goals_scored -
                            cachedPlayerData.goals;

                        livePlayerData.goals_scored > cachedPlayerData.goals
                            ? (player.goals =
                                  livePlayerData.goals_scored -
                                  cachedPlayerData.goals)
                            : (player.goals = player.goals);

                        ownGoalDiff =
                            livePlayerData.own_goals -
                            cachedPlayerData.own_goals;

                        livePlayerData.own_goals > cachedPlayerData.own_goals
                            ? (player.own_goals =
                                  livePlayerData.own_goals -
                                  cachedPlayerData.own_goals)
                            : (player.own_goals = player.own_goals);

                        netGoalDiff = goalDiff - ownGoalDiff;
                        updatePrisma = true;
                        console.log(
                            `${kickoffTime}: ${player.id} > Updated player in cache: `,
                            player
                        );
                    } else {
                        updatePrisma = false;
                        console.log(
                            `${kickoffTime}: ${player.id} > No cache update needed.`
                        );
                    }
                }

                if (updatePrisma) {
                    if (isNew) {
                        goalDiff = livePlayerData.goals_scored;
                        ownGoalDiff = livePlayerData.own_goals;
                        netGoalDiff = goalDiff - ownGoalDiff;
                    }

                    player.net_goals = netGoalDiff + player.net_goals;

                    console.log(
                        `${kickoffTime}: ${player.id} > New player data object to save: `,
                        player
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
                        `${kickoffTime}: ${player.id} > Updated player: `,
                        updatedPlayer
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
                        `${kickoffTime}: ${player.id} > Queried entries successfully.`
                    );

                    for (const entry of iteratableEntries) {
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
                                        players {
                                            id
                                            fn
                                            ln
                                            goals
                                            own_goals
                                            net_goals
                                        }
                                    }
                                }`;

                        const updatedEntry = await fetchGQL(
                            updateEntry,
                            updateEntryInput
                        );

                        console.log(
                            `${kickoffTime}: ${player.id} > Entry updated.`
                        );
                    }
                } else {
                    console.log(
                        `${kickoffTime}: ${player.id} > No changes in player goals.`
                    );
                }
                console.log(
                    `${kickoffTime}: ${player.id} > Iteration complete for player ${player.id}`
                );
            }
        } catch (err) {
            if (parentPort) {
                parentPort.postMessage(
                    `${kickoffTime} > Something went wrong...`
                );
                parentPort.postMessage(err);
                process.exit(1);
            } else {
                console.log(`${kickoffTime} > Something went wrong...`);
                console.error(err);
                process.exit(1);
            }
        }
        if (i === 2) {
            if (parentPort) {
                parentPort.postMessage(`${kickoffTime} > Process complete...`);
                parentPort.postMessage('done');
            } else {
                console.log(`${kickoffTime} > Process complete...`);
                console.log('done');
                process.exit(0);
            }
        }
    }, 1000);
};

updateGoalData();

// iterate for the whole match time and then save after the iterations are done if changes are needed to be saved. !!!!
