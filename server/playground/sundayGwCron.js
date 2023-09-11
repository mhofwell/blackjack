import { PrismaClient } from '@prisma/client';
import sortByDateAsc from '../utils/date-utils.js';

const prisma = new PrismaClient();

const test = async () => {
    await prisma.fixtures.deleteMany();

    const res = await fetch(
        `https://fantasy.premierleague.com/api/fixtures?future=1`
    );
    const data = await res.json();
    const gameWeekId = data[0].event;

    // set up the array to hold the gameweek information
    const nextGameweekKickoffTimes = [];

    // get the length of the array that holds games in that game week. This will help us reduce our processing load.
    let numberOfGames = 0;

    // remove duplicate kickoff times
    for (const id in data) {
        if (
            data[id].event === 5 &&
            nextGameweekKickoffTimes.indexOf(data[id].kickoff_time) < 0
        ) {
            nextGameweekKickoffTimes.push(data[id].kickoff_time);
            numberOfGames = ++numberOfGames;
        } else {
            if (nextGameweekKickoffTimes.indexOf(data[id].kickoff_time) > -1) {
                numberOfGames = ++numberOfGames;
            }
        }
    }

    let gameweekCronJobInfo = [];

    nextGameweekKickoffTimes.forEach((kickoffTime) => {
        const ms_kickoff_time = Date.parse(kickoffTime);

        const entry = {
            game_week_id: gameWeekId,
            number_of_fixtures: numberOfGames,
            kickoff_time: kickoffTime,
            ms_kickoff_time: ms_kickoff_time,
        };
        gameweekCronJobInfo.push(entry);
    });

    const count = await prisma.fixtures.createMany({
        data: gameweekCronJobInfo,
    });

    console.log(count);
};

test();

//--> Cron 2: for the next (number_of_games) fixtures
//--> search first numberOfGames in the array for kickoffTime === kickoff_time.
//--> retreive all club Ids that kickoff at that time that match Ids in our database, include Players. Extract player Id.
//--> Every 2 mins query  https://fantasy.premierleague.com/api/event/{gameWeek}/live/ and search for playerId = id.
//--> If goals, own_goals === 0 do nothing. Else mutuate the player entry in our database and the entry where the player exists' goal total.


