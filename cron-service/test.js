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

async function getLiveGoalData() {
    const res = await fetch(
        'https://fantasy.premierleague.com/api/fixtures?event=20'
    );
    const obj = await res.json();

    // we have to get kt here and search the object by kt

    const allStats = obj[0].stats;

    const goalStats = allStats.find(
        (stat) => stat.identifier === 'goals_scored'
    );

   // if away or home have no goals return 
   // if yes then combine?  

    

    const ownGoalStats = allStats.find(
        (stat) => stat.identifier === 'own_goals'
    );

    return { goalStats, ownGoalStats };
}

async function main() {
    const liveGoalData = await getLiveGoalData();

    console.log(liveGoalData);
}

main();
