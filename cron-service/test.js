const fetchGQL = require('./utils/fetch.js');

const query = `query Query {
        allKickoffTimes {
          id
          game_week_id
          kickoff_time
          ms_kickoff_time
          number_of_fixtures
        }
      }`;

async function test() {
    const res = await fetchGQL(query, {});
    console.log('response', res);
    const fixtures = res.allKickoffTimes;
    console.log(fixtures);
}

test();
