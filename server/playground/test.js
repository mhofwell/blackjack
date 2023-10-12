import 'dotenv/config';
import fetchGQL from '../utils/graphql/fetch.js';

const kickoffTime = new Date('2023-10-21T14:00:00Z').toString();

const numberOfFixtures = 5;

const data = {
    input: {
        kickoffTime,
        numberOfFixtures,
    },
};

console.log(data);

const query = ` query GetGameweekPlayers($input: getGameweekPlayers) {
        getGameweekPlayers(input: $input) {
          id
          net_goals
          own_goals
          goals
        }
      }`;

const res = await fetchGQL(query, data);

console.log(res.getGameweekPlayers);
