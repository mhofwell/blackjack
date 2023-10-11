import getUpcomingPlayers from '../utils/data/getUpcomingPlayers.js';
import { parentPort } from 'worker_threads';
import { PrismaClient } from '@prisma/client';
import playerState from '../state/playerUpdateState.js';
const prisma = new PrismaClient();

// const { kickoffTime, numberOfFixtures, gameWeekId } = workerData;
const numberOfFixtures = 5;
const gameWeekId = 8;
const kickoffTime = new Date('2023-10-07T11:30:00Z').toString();
console.log('kickoffTime ', kickoffTime);

let updatePrisma = false;
let i = 0;

const players = await getUpcomingPlayers(kickoffTime, numberOfFixtures);

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
                let updatePlayerInput = {};

                parentPort.postMessage(
                    `--------->  Fetching player from DB ${player.id}`
                );
                // console.log(
                //     `--------->  Fetching player from DB ${player.id}`
                // );

                const getPlayer = `query Query($playerId: ID!) {
                    player(id: $playerId) {
                      id
                      net_goals
                      own_goals
                      goals
                    }
                  }`;

                // get player data from database.
                const pObjDb = async () => {
                    try {
                        const res = await fetch(
                            'http://localhost:8080/graphql',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    query: getPlayer,
                                    variables: {
                                        playerId: id,
                                    },
                                }),
                            }
                        );
                        const data = await res.json();
                        return data;
                    } catch (err) {
                        console.error(err);
                    }
                };

                const dbPlayer = await pObjDb();

                console.log(dbPlayer);

                // we only care about the last state of the live update!
                const livePlayer = data.elements[player.id - 1];

                const playerIndex = playerState.indexOf(livePlayer.id);

                let lastState;

                if (playerIndex < 0) {
                    const length = playerState.push(livePlayer);
                    const index = length - 1;
                    lastState = playerState[index];
                } else {
                    lastState = playerState[playerIndex];
                }

                // console.log(
                //     `---------> Fetching player live data for player id ${player.id}`
                // );
                parentPort.postMessage(
                    `---------> Fetching player live data for player id ${player.id}`
                );

                const goalDiff = livePlayer.goals_scored - lastState.goals;
                const ownGoalDiff = livePlayer.own_scored - lastState.own_goals;
                const netGoalDiff =
                    livePlayer.goals_scored - livePlayer.own_goals;

                if (goalDiff > 0) {
                    dbPlayer.goals = dbPlayer.goals + goalDiff;
                    dbPlayer.net_goals = dbPlayer.net_goals + goalDiff;
                    updatePrisma = true;
                }
                if (ownGoalDiff > 0) {
                    dbPlayer.own_goals = dbPlayer.own_goals + ownGoalDiff;
                    dbPlayer.net_goals = net_goals--;
                    updatePrisma = true;
                }

                if (netGoalDiff > 0) {
                    dbPlayer.net_goals = dbPlayer.net_goals + netGoalDiff;
                }

                console.log('Fetched live data for player: ', playerObject);

                if (updatePrisma) {
                    console.log('New player data object to save: ', goalData);
                    // parentPort.postMessage('New player data object to save: ', goalData);
                    const updatedPlayer = await prisma.player.update({
                        where: {
                            id: player.id,
                        },
                        data: dbPlayer,
                    });
                    console.log('Updated player ', updatedPlayer);
                    // parentPort.postMessage(`Updated! ${updatedPlayer}`);

                    console.log('New entry data to save.');
                    // parentPort.postMessage('New player data object to save: ', goalData);

                    // work on the Query for this entry!
                    player.entry.forEach(async (entry) => {
                        const e = await prisma.entry.findUnique({
                            where: {
                                id: entry.id,
                            },
                        });

                        e.goals = e.goals + goalDiff;
                        e.own_goals = e.own_goals + ownGoalDiff;
                        e.net_goals = e.net_goals + netGoalDiff;

                        const updateEntryInput = {
                            id: entry.id,
                            goals: e.goals,
                            own_goals: e.own_goals,
                            net_goals: e.net_goals,
                        };

                        const updateEntry = `mutation Mutation($input: updateEntryInput!) {
                            updateEntry(input: $input) {
                              id
                              net_goals
                              own_goals
                              goals
                            }
                        }`;

                        const submit = async () => {
                            try {
                                const res = await fetch(
                                    'http://localhost:8080/graphql',
                                    {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            query: updateEntry,
                                            variables: {
                                                input: updateEntryInput,
                                            },
                                        }),
                                    }
                                );
                                const data = await res.json();
                                return data;
                            } catch (err) {
                                console.error(err);
                            }
                        };

                        const entryUpdated = await submit();

                        console.log('Entry updated: ', entryUpdated);
                    });
                } else {
                    console.log('No changes in player goals.');
                    // parentPort.postMessage('No changes in player goals.');
                }
                console.log(`Iteration complete for player ${player.id}`);
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
        if (i === 1) {
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
