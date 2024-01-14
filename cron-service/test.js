// improvements
// can we get a list of all the players, and the entry UUID's they belong to? Get that, save it and use it below.
// replace console.log with logger

// --

// inputs for the function set to work properly. 
const kt = '2023-12-30T12:30:00Z';
const gw = 20;

// this returns the life Gameweek Data
// this requires the input of the gameweek week.
async function getLiveGameweekData() {
    try {
        const res = await fetch(
            `https://fantasy.premierleague.com/api/fixtures?event=${gw}`
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

// check for a change in the size of the goal and own goal arrays.
function checkForGoalEvent() {}

// check if the goal was from a player in a pool entry.
function checkForValidPlayer() {}

// if we care about the player, create the cached player data array.
// maybe we should create a db entry for all of the players in all entries so we can quick index that.
async function cacheGoalData(fixtures) {}

// get the db ppol entries that contain the player who scored
async function getEntries() {}

// update the pool entries goals and net goals by the number og goals that scored
// update entry status here as well: RANKED, UNRANKED, LOST
// save entries
// return entries (or maybe only pool UUID of the entries to sort)
async function updateEntries() {}

// Take in pool UUID's that we need to sort
// if RANKED, sortByDesc net goals, assign # rank, push into array.
// if UNRANKED, push into array
// if LOST, push into array
// push subscription event through with newly sorted pools.
async function sortPools() {}

async function main() {
    const liveGameweekData = await getLiveGameweekData();

    // console.log('liveGoalData', liveGameweekData);

    const fixtures = await getFixtures(liveGameweekData, kt);

    console.log('fixtures', fixtures);
}

main();
