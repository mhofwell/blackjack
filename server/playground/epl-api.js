import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sortByDateAsc = (a, b) => {
    return new Date(a.date) - new Date(b.date);
};

const test = async () => {
    const res = await fetch(
        `https://fantasy.premierleague.com/api/fixtures?future=1`
    );
    const data = await res.json();
    const nextGameWeek = data[0].event;

    // console.log(nextGameWeek);

    // get weekly fixures every Sunday at midnight CRON 1
    const fixturesInNextGameWeek = data.filter(
        (fixture) => fixture.event === nextGameWeek
    );

    // console.log(fixturesInNextGameWeek);

    // get all clubs in postgres database.
    const allClubsInPool = await prisma.club.findMany({
        select: {
            id: true,
            name: true,
            logo: true,
        },
    });

    // console.log(allClubsInPool);

    const clubIdsInPool = allClubsInPool.map((club) => club.id);

    // console.log(clubIdsInPool);

    // filter for fixtures that only have clubs in our data base, return those fixtures.
    const fixturesWithClubsInPool = await fixturesInNextGameWeek.filter(
        (fixture) =>
            clubIdsInPool.some((id) => fixture.team_a || fixture.team_h === id)
    );

    // console.log(fixturesWithClubsInPool);

    const fixtureKickoffTimes = fixturesWithClubsInPool.map(
        (fixture) => fixture.kickoff_time
    );
    // console.log(fixtureKickoffTimes);

    // filter for fixtures only that have clubs in our data base, return those fixtures.
    let clubsInNextGameWeekInPool = [];

    await fixturesWithClubsInPool.forEach((fixture) => {
        if (clubIdsInPool.indexOf(fixture.team_h) > -1) {
            clubsInNextGameWeekInPool.push(fixture.team_h);
        }
        if (clubIdsInPool.indexOf(fixture.team_a) > -1) {
            clubsInNextGameWeekInPool.push(fixture.team_a);
        }
    });

    // console.log(clubsInNextGameWeekInPool);

    // get players playing in the coming week in those clubs.
    const playerIdsInNextGameWeek = [];

    for (const clubId of clubsInNextGameWeekInPool) {
        const clubObject = await prisma.club.findUnique({
            where: {
                id: clubId,
            },
            select: {
                players: true,
            },
        });

        const playersInClub = clubObject.players;

        playersInClub.forEach((player) =>
            playerIdsInNextGameWeek.push(player.id)
        );
    }
    console.log(playerIdsInNextGameWeek);
};

test();

// const timeNow = Date.now();

// const fixtureTimeStamp = Date.parse(allFixturesForThePool[0]);
// const difference = fixtureTimeStamp - timeNow;

// console.log(`time difference is: ${difference}`);

// const hours = Math.floor(difference / 3600000);
// const minutes = Math.floor((difference % 3600000) / 60000);
// const seconds = Math.floor(((difference % 360000) % 60000) / 1000);
// console.log(`${hours}h ${minutes}m ${seconds}s`);

// For Frontend

// weekly cron job on Sunday at midnight PDT
// get all the fixtures for the coming week
//https://fantasy.premierleague.com/api/fixtures?future=1

// get clubs for each fixture

// home team id
// home team name
// away team id
// away team name
// kickoff time
// game week

// get players in those clubs in each fixture.

// findMany for home team
// findMany for away team
// each player get fn ln goals, net, own, club id
// match club id with home or away

// [
//     {
//         fixture_id,
//         fixture_kickoff,
//         gameweek,
//         home_club: {
//             name: Chelsea,
//             players: [
//                 {
//                     fn,
//                     ln,
//                     net_goals,
//                 },
//             ],
//         },
//         away_club: {
//             name: Everton,
//             players: [
//                 {
//                     fn,
//                     ln,
//                     net_goals,
//                 },
//             ],
//         },
//     },
// ];

// get weekly fixures every Sunday at midnight CRON 1
//--->  https://fantasy.premierleague.com/api/fixtures?future=1
//---> get eventId (Fixture week)

// get all clubs in postgres database.
//---> club.findMany() to get an array of club objects. get Ids

// filter for fixtures only that have clubs in our data base, return those fixtures.
//---> forEach fixture, get
//---> team_a: Int
//---> team_h: Int
//---> kickoff_time: Date()

// get players playing in the coming week in those clubs.
//---> forEach fixture
//---> club.findMany() where: id: team_a || team_h include: players: true
//---> get player Id's

// get time now and set cron job for when time now - kickoff time = 0

// cron job queries live data API, searches for the player objects in the array that match ids of players in that game
//---> https://fantasy.premierleague.com/api/event/{eventId}/live/
//---> findIndex of each player Id in live array.

// evaluate change in goals_scored, own_goals, save the difference.
//---> if goals_scored, own_goals === 0, do nothing.
//---> else if goals_scored > 0 increase player goals by (x), else if own_goals > -, increase player own_goals by (y)
//---> save goals_scored, own_goals for each player.
//---> update entries with those players goals

// next query
//---> if goals_scored > (x) or own_goals > (x) then
//---> save goals_scored, own_goals for each player.
//---> update entries with those players goals

// repeat cron job every 2 minutes until 3 hours is up.
