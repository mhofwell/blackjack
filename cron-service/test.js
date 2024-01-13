// new updatePlayerGoals.js

// get all player ids that are playing this game week into an array.
// Poll API for changes to live scores every two minutes.
// If someone scores, check if we care about that player against ID's in that array.
// If yes,
// // get that player
// // do we have it in cache already?
// // if no
// // // store current goal state in Redis cahce for that player
// // +1 to goals, net_goals of that players stats.
// // if yes
// // //
// Get all entries that have that player
// // For each entry containing that player
// // +1 to goals, net_goals on entries with that player.
// // save entry

// Re-sort Pool that the entry is in.

// // Fetch pool entries
// // Entries < 21 total && all 4 players have goals > 0 move into an array.
// // entries.sort(sortByDesc)
// // for each entry rank = entry.indexOf(entries) + 1
// Entries with not A4S and < 21 rank = "-"
// Entries with > 21 goals, rank = "BUST!"

// // create helper functions for A4S and <21 goal checks.

// we're going to need to compare 2 different array's.

// const array1a = stats[0].a
// const array1h = stats[0].h

const kt = '2023-12-30T12:30:00Z';

async function getLiveGameweekData() {
    try {
        const res = await fetch(
            'https://fantasy.premierleague.com/api/fixtures?event=20'
        );
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
    }
}

function getFixtures(data, kt) {
    const fixtures = [];
    for (const fixture of data) {
        if (fixture.kickoff_time === kt) {
            fixtures.push(fixture);
        }
    }
    return fixtures;
}

async function main() {
    const liveGameweekData = await getLiveGameweekData();

    // console.log('liveGoalData', liveGameweekData);

    const fixtures = await getFixtures(liveGameweekData, kt);

    console.log('fixtures', fixtures);
}

main();
