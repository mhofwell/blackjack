// improvements
// can we get a list of all the players, and the entry UUID's they belong to? Get that, save it and use it below.
// replace console.log with logger

// this returns the live Gameweek Data
// this requires the input of the gameweek week.
async function getLiveGameweekData(gameWeek) {
    try {
        const res = await fetch(
            `https://fantasy.premierleague.com/api/fixtures?event=${gameWeek}`
        );
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
    }
}

function getFixturesFromData(data, kickoffTime) {
    const fixtures = [];
    for (const fixture of data) {
        if (fixture.kickoff_time === kickoffTime) {
            fixtures.push(fixture);
        }
    }
    return fixtures;
}

// This function returns all the players in the database.
async function getPlayerList() {
    // call the API route to return player ID's for clubs that play in this kt.
    // create the GraphQL API route
    return [362, 154, 222];
}

// return players who have scored a goal or an own goal
function getGoalStats(fixtures, playerList) {
    let goalStats = [];
    let ownGoalStats = [];

    for (let fixture of fixtures) {
        const goalsScored = fixture.stats.find(
            (stat) => stat.identifier === 'goals_scored'
        );
        const ownGoals = fixture.stats.find(
            (stat) => stat.identifier === 'own_goals'
        );

        goalStats = goalStats.concat(goalsScored.a, goalsScored.h);
        ownGoalStats = ownGoalStats.concat(ownGoals.a, ownGoals.h);
    }

    const stats = { goalStats, ownGoalStats };

    return stats;
}

function filterGoalStats({ goalStats, ownGoalStats }, playerList) {
    let filteredGoalStats = [];

    function removeNonEntryPlayers(stat) {
        return playerList.indexOf(stat.element) > -1;
    }

    goalStats.length > 0
        ? (filteredGoalStats = goalStats.filter(removeNonEntryPlayers))
        : (filteredGoalStats = goalStats);

    let filteredOwnGoalStats = [];

    ownGoalStats.length > 0
        ? (filteredOwnGoalStats = ownGoalStats.filter(removeNonEntryPlayers))
        : (filteredOwnGoalStats = ownGoalStats);

    const filteredStats = { filteredGoalStats, filteredOwnGoalStats };

    return filteredStats;
}

// inputs for the function set to work properly.
const ITERATION_LENGTH = 2000;
const ITERATIONS = 1;
const kt = '2023-12-30T12:30:00Z';
const gw = 20;
// Goal: Once a player scores a goal or own goal we need to update every user entry across all pools that contain the player(s) who scored.
async function main(gw, kt) {
    const playerList = await getPlayerList();

    let i = 0;

    setInterval(async () => {
        i++;

        // Get live game week data
        const liveGameweekData = await getLiveGameweekData(gw);

        // Extract the fixtures playing at this kickoff time
        const fixtures = getFixturesFromData(liveGameweekData, kt);

        // Retrieve live goal stats for players in this kickoff time.
        const stats = getGoalStats(fixtures, playerList);

        // Early return. If no stats exist, end iteration.
        if (stats.ownGoalStats.length === 0 && stats.goalStats.length === 0) {
            console.log(
                `i: ${i} No change in initial length. Ending iteration.`
            );
            return;
        }

        // Filter goal stats to remove players who are not in any active entry.
        const filteredStats = filterGoalStats(stats, playerList);

        // check if there's a cache.

        // if cahce and this array are DE, early return #2.

        console.log(filteredStats);

        if (i === ITERATIONS) {
            console.log(`${kt} > Process complete...`);
            process.exit(0);
        }
    }, ITERATION_LENGTH);
}

main(gw, kt);
