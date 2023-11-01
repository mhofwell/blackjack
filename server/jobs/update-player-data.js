import { workerData, parentPort } from 'worker_threads';

// test data
// import testData from './test-data.js';

// utils
import fetchGQL from '../utils/graphql/fetch.js';
import { getRedisJSON, setRedisJSON } from '../utils/redis/json.js';

// keys
import PLAYER_KEY from '../utils/redis/keys/index.js';

// logging
import getLogger from '../logging/logger.js';

const logger = getLogger('worker');

const updateGoalData = async () => {
    let { kickoffTime, numberOfFixtures, gameWeekId } = workerData;

    // const kickoffTime = '2023-11-04T15:00:00Z';
    // const numberOfFixtures = 10;
    // const gameWeekId = 10;

    if (parentPort) {
        parentPort.postMessage(`Worker starting...👷 `);
    } else {
        logger.info(`Worker starting...👷 `);
    }

    const queryData = {
        input: {
            kickoffTime: new Date(kickoffTime).toString(),
            numberOfFixtures,
        },
    };

    const query = `query Query($input: getGameweekPlayers) {
        getGameweekPlayers(input: $input) {
          id
          goals
          own_goals
          net_goals
        }
      }`;

    const res = await fetchGQL(query, queryData);

    if (!res) {
        throw new Error('Could not fetch gameweek players from the database.');
    }

    let players = res.getGameweekPlayers;

    let goalDiff;
    let ownGoalDiff;
    let netGoalDiff;
    let updatePrisma = false;
    let i = 0;

    setInterval(async () => {
        i++;
        if (parentPort) {
            parentPort.postMessage(
                `Fetched gameweek players in the database for iteration: ${i}`
            );
        } else {
            logger.info(
                `Fetched gameweek players in the database for Iteration: ${i}`
            );
        }
        try {
            // fetch gameweek players from EPL
            const res = await fetch(
                `https://fantasy.premierleague.com/api/event/${
                    gameWeekId - 1
                }/live/`
            );

            if (parentPort) {
                parentPort.postMessage(
                    `Fetched live player data from the EPL API for gameweek ${gameWeekId}.`
                );
            } else {
                logger.info(
                    `Fetched live player data from the EPL API for gameweek ${gameWeekId}.`
                );
            }

            const data = await res.json();
            // const data = testData;

            if (data.elements.length === 0) {
                if (parentPort) {
                    parentPort.postMessage(
                        `Gameweek ${gameWeekId} has not started yet!`
                    );
                    parentPort.postMessage('done');
                    process.exit(0);
                } else {
                    logger.warn(`Gameweek ${gameWeekId} has not started yet!`);
                    process.exit(0);
                }
            }

            // for each player in our array of players
            for (const player of players) {
                let isNew;

                if (parentPort) {
                    parentPort.postMessage(
                        `${player.id} > Evaluating player from database.`
                    );
                } else {
                    logger.info(
                        `${player.id} > Evaluating player from database.`
                    );
                }
                // get the index of the player in the EPL API data
                const livePlayerIndex = data.elements.findIndex(
                    (element) => element.id === player.id
                );

                if (livePlayerIndex >= 0) {
                    if (parentPort) {
                        parentPort.postMessage(
                            `${player.id} > Player in EPL data found.`
                        );
                    } else {
                        logger.info(`${player.id} > Player in EPL data found.`);
                        logger.debug(
                            { player: player },
                            `${player.id} > Player in EPL data found.`
                        );
                    }
                } else {
                    if (parentPort) {
                        parentPort.postMessage(
                            `${player.id} > Player in EPL data not found.`
                        );
                    } else {
                        logger.info(
                            `${player.id} > Player in EPL data not found.`
                        );
                    }
                    process.exit(1);
                }

                const livePlayerData = data.elements[livePlayerIndex].stats;

                // see if the player exists in the cache.
                const cachedPlayerData = await getRedisJSON(
                    PLAYER_KEY,
                    data.elements[livePlayerIndex].id
                );

                // if player does not exist in redis
                if (!cachedPlayerData) {
                    isNew = true;

                    if (parentPort) {
                        parentPort.postMessage(
                            `${player.id} > No cached player data found.`
                        );
                    } else {
                        logger.info(
                            `${player.id} > No cached player data found.`
                        );
                    }

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

                    if (logger) {
                        logger.debug(`Update prisma: ${updatePrisma}`);
                    }

                    const newRedisData = {
                        id: data.elements[livePlayerIndex].id,
                        goals: livePlayerData.goals_scored,
                        own_goals: livePlayerData.own_goals,
                        net_goals:
                            livePlayerData.goals_scored -
                            livePlayerData.own_goals,
                    };

                    // save player in redis cache.
                    const redisPlayer = await setRedisJSON(
                        PLAYER_KEY,
                        player.id,
                        newRedisData
                    );

                    if (parentPort) {
                        parentPort.postMessage(
                            `${player.id} > Saved new player in Redis cache successfully.`
                        );
                    } else {
                        logger.info(
                            `${player.id} > Saved new player in Redis cache successfully.`
                        );
                        logger.debug(
                            { redisPlayer: redisPlayer },
                            `${player.id} > Redis player.`
                        );
                    }
                } else {
                    // player does exist in redis
                    isNew = false;

                    if (parentPort) {
                        parentPort.postMessage(
                            `${player.id} > Cached player data found.`
                        );
                    } else {
                        logger.info(`${player.id} > Cached player data found.`);
                        logger.debug(
                            { cachedPlayerData: cachedPlayerData },
                            `${player.id} > Cached player.`
                        );
                    }
                    // evaluate if there's a change in goal stats between live and cache.
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

                        if (parentPort) {
                            parentPort.postMessage(
                                `${player.id} > Updated player in cache`
                            );
                        } else {
                            logger.info(
                                `${player.id} > Updated player in cache`
                            );
                            logger.debug(
                                { redisPlayer: redisPlayer },
                                `${player.id} > Redis player.`
                            );
                        }
                    } else {
                        updatePrisma = false;

                        if (parentPort) {
                            parentPort.postMessage(
                                `${player.id} > No cache update needed.`
                            );
                        } else {
                            logger.info(
                                `${player.id} > No cache update needed.`
                            );
                        }
                    }
                }
                if (updatePrisma) {
                    if (isNew) {
                        goalDiff = livePlayerData.goals_scored;
                        ownGoalDiff = livePlayerData.own_goals;
                        netGoalDiff = goalDiff - ownGoalDiff;
                    }

                    player.net_goals = netGoalDiff + player.net_goals;

                    if (parentPort) {
                        parentPort.postMessage(
                            `${player.id} > New player data object to save.`
                        );
                    } else {
                        logger.info(
                            `${player.id} > New player data object to save.`
                        );
                        logger.debug({ player: player }, `Player object.`);
                    }

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

                    if (parentPort && updatedPlayer) {
                        parentPort.postMessage(
                            `${player.id} > Updated player.`
                        );
                    } else {
                        logger.info(`${player.id} > Updated player.`);
                    }

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

                    if (parentPort) {
                        parentPort.postMessage(
                            `${player.id} > Queried entries successfully.`
                        );
                    } else {
                        logger.info(
                            `${player.id} > Queried entries successfully.`
                        );
                        logger.debug(
                            { iteratableEntries: iteratableEntries },
                            'Iterable Entries.'
                        );
                    }

                    for (const entry of iteratableEntries) {
                        const input = {
                            id: entry.id,
                            goals: entry.goals + goalDiff,
                            own_goals: entry.own_goals + ownGoalDiff,
                            net_goals: entry.net_goals + netGoalDiff,
                        };
                        const updatePoolInput = {
                            input,
                        };

                        const updatePool = `mutation UpdatePool($input: updateEntryInput!) {
                            updatePool(input: $input) {
                              id
                            }
                          }`;

                        const updatedPool = await fetchGQL(
                            updatePool,
                            updatePoolInput
                        );

                        if (parentPort) {
                            parentPort.postMessage(
                                `${player.id} > Entry & pool updated.`
                            );
                        } else {
                            logger.info(`${player.id} > Entry & pool updated.`);
                            logger.debug(
                                { updatedPool: updatedPool },
                                'Updated Pool'
                            );
                        }
                    }
                } else {
                    if (parentPort) {
                        parentPort.postMessage(
                            `${player.id} > No changes in player goals.`
                        );
                    } else {
                        logger.info(
                            `${player.id} > No changes in player goals.`
                        );
                    }
                }
                if (parentPort) {
                    parentPort.postMessage(
                        `${player.id} > Iteration ${i} complete for player ${player.id} ✅`
                    );
                } else {
                    logger.info(
                        `${player.id} > Iteration ${i} complete for player ${player.id} ✅`
                    );
                }
            }
        } catch (err) {
            if (parentPort) {
                parentPort.postMessage(
                    `${kickoffTime} > Something went wrong...`
                );
                parentPort.postMessage(err);
                process.exit(1);
            } else {
                logger.info(`${kickoffTime} > Something went wrong...`);
                logger.error(err);
                process.exit(1);
            }
        }
        if (i === 2) {
            if (parentPort) {
                parentPort.postMessage('done');
                process.exit(0);
            } else {
                logger.info(`${kickoffTime} > Process complete...`);
                process.exit(0);
            }
        }
    }, 1000);
};

updateGoalData();
