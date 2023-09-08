import { PrismaClient } from '@prisma/client';
import sortByDateAsc from '../utils/date-utils';

const prisma = new PrismaClient();

const test = async () => {
    // await prisma.gameweek.deleteMany();

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

    console.log(fixturesWithClubsInPool.length);

    const fixtureOrderArray = [];

    const n = fixturesWithClubsInPool.length;

    for (let i = 0; i < n; i++) {
        console.log('Count Index ', i);

        const homeTeamId = fixturesWithClubsInPool[i].team_h;
        const awayTeamId = fixturesWithClubsInPool[i].team_a;
        const kickoff_time = fixturesWithClubsInPool[i].kickoff_time;

        let clubs = [];
        let players = [];

        const fixtureIndex =
            fixturesWithClubsInPool[i].kickoff_time.indexOf(fixtureOrderArray);

        console.log('Fixture Index ', fixtureIndex);

        if (fixtureIndex < 0) {
            // clubs in fixtures that are also in our pool
            if (clubIdsInPool.indexOf(homeTeamId) > -1) {
                clubs.push(homeTeamId);

                // get players in that club
                const clubObjectWithPlayers = await prisma.club.findUnique({
                    where: {
                        id: homeTeamId,
                    },
                    select: {
                        players: true,
                    },
                });

                // iterate through array and push ids into player array
                clubObjectWithPlayers.players.forEach((player) => {
                    players.push(player.id);
                });
            }

            if (clubIdsInPool.indexOf(awayTeamId) > -1) {
                clubs.push(awayTeamId);

                const clubObjectWithPlayers = await prisma.club.findUnique({
                    where: {
                        id: awayTeamId,
                    },
                    select: {
                        players: true,
                    },
                });

                clubObjectWithPlayers.players.forEach((player) => {
                    players.push(player.id);
                });
            }
        } else {
            if (clubIdsInPool.indexOf(homeTeamId) > -1) {
                clubs.push(homeTeamId);

                // get players in that club
                const clubObjectWithPlayers = await prisma.club.findUnique({
                    where: {
                        id: homeTeamId,
                    },
                    select: {
                        players: true,
                    },
                });

                // iterate through array and push ids into player array
                clubObjectWithPlayers.players.forEach((player) => {
                    players.push(player.id);
                });
            }

            if (clubIdsInPool.indexOf(awayTeamId) > -1) {
                clubs.push(awayTeamId);

                const clubObjectWithPlayers = await prisma.club.findUnique({
                    where: {
                        id: awayTeamId,
                    },
                    select: {
                        players: true,
                    },
                });

                clubObjectWithPlayers.players.forEach((player) => {
                    players.push(player.id);
                });
            }
            clubs.push(homeTeamId, awayTeamId);
        }
        const entry = {
            kickoff_time: kickoff_time,
            players: players,
            clubs: clubs,
        };
        console.log(entry);

        fixtureOrderArray.push(entry);
    }

    // sort fixtures into order based on time from Sunday.
    fixtureOrderArray.sort(sortByDateAsc);
    console.log(fixtureOrderArray);
};

test();
