import { PrismaClient } from '@prisma/client';
import sortByDateAsc from '../utils/date-utils.js';

const prisma = new PrismaClient();

const test = async () => {
    // await prisma.gameweek.deleteMany();

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

    nextGameweekKickoffTimes.sort(sortByDateAsc);

    const gameweekCronJobInfo = {
        numberOfGames: numberOfGames,
        gameWeekId: gameWeekId,
        kickoffTimes: nextGameweekKickoffTimes,
    };

    console.log(gameweekCronJobInfo);

        // save in prisma?

        // prisma.kickoffTimes.insertMany({})
        // id: int increment,
        // gameWeekId: gameWeekId, 
        // numberOfGames: numberOfGames, 
        // kickoffTime: kickoffTimes 



};

test();

//--> Cron 2: for all kickoff times, Get next kickoffTime, set 3 hour cron job every 2 mins. 
//--> search first numberOfGames in the array for kickoffTime === kickoff_time.
//--> retreive all club Ids that kickoff at that time that match Ids in our database, include Players. Extract player Id.
//--> Every 2 mins query  https://fantasy.premierleague.com/api/event/{gameWeek}/live/ and search for playerId = id.
//--> If goals, own_goals === 0 do nothing. Else mutuate the player entry in our database and the entry where the player exists' goal total.
