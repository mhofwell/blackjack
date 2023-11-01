let res = await fetch(
    'https://fantasy.premierleague.com/api/fixtures?future=1'
);

if (!res) {
    throw new Error(
        `${inputKT} > Cannot fetch upcoming fixture information from EPL API, check connection.`
    );
}
const n = 10;

let data = await res.json();

const weeklyFixtures = data.slice(0, n - 1);

await weeklyFixtures.forEach((fixture) => {
    console.log(fixture.kickoff_time);
    // const fixtureKT = new Date(fixture.kickoff_time).toString();

    // if (fixtureKT === inputKT) {
    //     teamIdArray.push(fixture.team_a);
    //     teamIdArray.push(fixture.team_h);
    // }
});
