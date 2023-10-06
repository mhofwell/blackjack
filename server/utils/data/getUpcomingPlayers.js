import { PrismaClient } from '@prisma/client';

const getUpcomingPlayers = async (kickoffTime, numberOfFixtures) => {
    const prisma = new PrismaClient();
    const players = [];
    const teamIdArray = [];

    try {
        let res = await fetch(
            'https://fantasy.premierleague.com/api/fixtures?future=1'
        );

        if (!res) {
            throw new Error(
                '---------> Cannot fetch upcoming fixture information from EPL API, check connection.'
            );
        }

        // parentPort.postMessage(
        //     `----> Upcoming fixture information fetched for the next gameweek.`
        // );
        console.log(
            `---------> Upcoming fixture information fetched for the next gameweek.`
        );

        let data = await res.json();
        const weeklyFixtures = data.slice(0, numberOfFixtures - 1);

        console.log('Weekly Fixtures ', weeklyFixtures);

        await weeklyFixtures.forEach((fixture) => {
            const fixtureDate = new Date(fixture.kickoff_time).toString();

            if (fixtureDate === kickoffTime) {
                teamIdArray.push(fixture.team_a);
                teamIdArray.push(fixture.team_h);
            }
        });

        console.log(`teamIdArray is ${teamIdArray}`);

        for (const id in teamIdArray) {
            const p = await prisma.player.findMany({
                where: {
                    club_id: teamIdArray[id],
                },
                select: {
                    id: true,
                    goals: true,
                    net_goals: true,
                    own_goals: true,
                },
            });
            if (!p) {
                throw new Error('---------> Cannot save player data to PRISMA');
            }
            p.forEach((player) => {
                players.push(player);
            });
            // parentPort.postMessage(
            //     `----> Players fetched for club ${teamIdArray[id]}`
            // );
            console.log(`---------> Players fetched for club ${teamIdArray[id]}`);
        }
        console.log('Players fetched: ', players);
        return players;
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export default getUpcomingPlayers;
