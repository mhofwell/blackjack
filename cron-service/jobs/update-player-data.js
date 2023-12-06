const { workerData, parentPort } = require('worker_threads');

// env
const dotenv = require('dotenv');
dotenv.config();

// test data
const testData = require('./test-data.js');

// utils
const fetchGQL = require('../utils/fetch.js');
const { getRedisJSON, setRedisJSON } = require('../utils/redis/json.js');

// keys
const PLAYER_KEY = require('../utils/redis/keys/index.js');

// constants
const { ITERATION_LENGTH, ITERATIONS } = require('../config.js');

// logging
const getLogger = require('../logging/logger.js');

const logger = getLogger('worker');

const updateGoalData = async () => {
    let { kickoffTime, gameWeekId } = workerData;

    // const kickoffTime = '2023-11-04T17:30:00Z';
    // const gameWeekId = 11;

    if (parentPort) {
        parentPort.postMessage(`Worker starting...👷 `);
    } else {
        logger.info(`Worker starting...👷 `);
    }

    const queryData = {
        input: {
            kickoffTime,
            gameWeekId,
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

    let i = 0;

    setInterval(async () => {
        console.log('test');
        i++;

        if (parentPort) {
            parentPort.postMessage(
                `Fetching gameweek players in the database for i: ${i}`
            );
        } else {
            logger.info(
                `Fetching gameweek players in the database for i: ${i}`
            );
        }
        try {
            // fetch gameweek players from EPL
            const res = await fetch(
                // event {gw} live. This gets players for the gameweek
                `https://fantasy.premierleague.com/api/event/${gameWeekId}/live`
            );

            if (parentPort) {
                parentPort.postMessage(
                    `Fetched live data from the EPL API for gw ${gameWeekId}.`
                );
            } else {
                logger.info(
                    `Fetched live player data from the EPL API for gameweek ${gameWeekId}.`
                );
            }

            const data = await res.json();
            // const data = testData;

            if (data.elements[0] === null) {
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
                let goalDiff = 0;
                let ownGoalDiff = 0;
                let netGoalDiff = 0;
                let updatePrisma = false;

                let isNew;

                logger.debug(
                    { player: player },
                    `${player.id} > Player object.`
                );

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

                const livePlayerData = data.elements[livePlayerIndex].stats;

                if (livePlayerIndex >= 0) {
                    if (parentPort) {
                        parentPort.postMessage(
                            `${player.id} > Player in EPL data found.`
                        );
                    } else {
                        logger.info(`${player.id} > Player in EPL data found.`);
                        logger.debug(
                            { livePlayerData: livePlayerData },
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

                logger.debug(
                    {
                        goals_scored: livePlayerData.goals_scored,
                        own_goals: livePlayerData.own_goals,
                    },
                    `${player.id} > Live goals_scored & own_goals i: ${i}`
                );

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

                    const newRedisData = {
                        id: data.elements[livePlayerIndex].id,
                        goals: livePlayerData.goals_scored,
                        own_goals: livePlayerData.own_goals,
                        net_goals:
                            livePlayerData.goals_scored -
                            livePlayerData.own_goals,
                    };

                    logger.debug(
                        { newRedisData: newRedisData },
                        'New redis data'
                    );

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
                        0
                    ) {
                        goalDiff =
                            livePlayerData.goals_scored -
                            cachedPlayerData.goals;

                        player.goals = player.goals + goalDiff;

                        cachedPlayerData.goals =
                            cachedPlayerData.goals + goalDiff;
                    }

                    if (
                        livePlayerData.own_goals - cachedPlayerData.own_goals >
                        0
                    ) {
                        ownGoalDiff =
                            livePlayerData.own_goals -
                            cachedPlayerData.own_goals;

                        // add goal diff to cached goals
                        cachedPlayerData.own_goals =
                            cachedPlayerData.own_goals + ownGoalDiff;

                        // add goal diff to player goals to save in db
                        player.own_goals = player.own_goals + ownGoalDiff;
                    }

                    netGoalDiff = goalDiff - ownGoalDiff;

                    if (goalDiff > 0 || ownGoalDiff > 0) {
                        player.net_goals = player.net_goals + netGoalDiff;
                        cachedPlayerData.net_goals =
                            cachedPlayerData.net_goals + netGoalDiff;

                        updatePrisma = true;

                        const redisPlayer = await setRedisJSON(
                            PLAYER_KEY,
                            player.id,
                            cachedPlayerData
                        );

                        if (parentPort) {
                            parentPort.postMessage(
                                `${player.id} > Goal stats changed, player updated in cache.`
                            );
                        } else {
                            logger.info(
                                `${player.id} > Goal stats changed, player updated in cache.`
                            );
                            logger.debug(
                                { redisPlayer: redisPlayer },
                                `${player.id} > Redis cache player.`
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

                logger.debug(`Update Prisma ${updatePrisma}`);

                if (updatePrisma) {
                    if (isNew) {
                        goalDiff = livePlayerData.goals_scored;
                        ownGoalDiff = livePlayerData.own_goals;
                        netGoalDiff = goalDiff - ownGoalDiff;
                    }

                    player.kickoffTime = kickoffTime;

                    logger.debug(
                        {
                            goalDiff: goalDiff,
                            ownGoalDiff: ownGoalDiff,
                            netGoalDiff: netGoalDiff,
                        },
                        `${player.id} > Goal differentials.`
                    );

                    if (parentPort) {
                        parentPort.postMessage(
                            `${player.id} > Change in goals detected during the match.`
                        );
                    } else {
                        logger.info(
                            `${player.id} > Change in goals detected during the match.`
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
                            `${player.id} > Updated player with new goal data in db.`
                        );
                    } else {
                        logger.info(`${player.id} > Updated player.`);
                    }

                    const entryQuery = `query PlayerEntries($playerEntriesId: Int!, $kickoffTime: String) {
                        playerEntries(id: $playerEntriesId, kickoffTime: $kickoffTime) {
                          id
                          goals
                          net_goals
                          own_goals
                        }
                      }`;

                    const entryQueryVariables = {
                        playerEntriesId: player.id,
                        kickoffTime: kickoffTime,
                    };

                    const dbEntries = await fetchGQL(
                        entryQuery,
                        entryQueryVariables
                    );

                    const iteratableEntries = dbEntries.playerEntries;

                    if (parentPort) {
                        parentPort.postMessage(
                            `${player.id} > Queried for entries the player is in successfully.`
                        );
                    } else {
                        logger.info(
                            `${player.id} > Queried for entries the player is in successfully.`
                        );
                        logger.debug(
                            { iteratableEntries: iteratableEntries },
                            'Iterable Entries.'
                        );
                    }

                    for (const entry of iteratableEntries) {
                        logger.debug({ entry: entry }, 'Entry object');

                        const input = {
                            id: entry.id,
                            goals: entry.goals + goalDiff,
                            own_goals: entry.own_goals + ownGoalDiff,
                            net_goals: entry.net_goals + netGoalDiff,
                            kickoffTime: kickoffTime,
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
                                `${player.id} > Pool standings and entries updated.`
                            );
                        } else {
                            logger.info(
                                `${player.id} > Pool standings and entries updated.`
                            );
                            logger.debug(
                                { updatedPool: updatedPool },
                                'Updated Pool Object'
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
                        `${player.id} > i: ${i} complete ✅`
                    );
                } else {
                    logger.info(`${player.id} > i: ${i} complete ✅`);
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
        if (i === ITERATIONS) {
            if (parentPort) {
                parentPort.postMessage('done');
            } else {
                logger.info(`${kickoffTime} > Process complete...`);
                process.exit(0);
            }
        }
    }, ITERATION_LENGTH);
};
updateGoalData();
