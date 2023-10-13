// import 'dotenv/config';
// import fetchGQL from '../utils/graphql/fetch.js';

// const kickoffTime = new Date('2023-10-21T14:00:00Z').toString();

// const numberOfFixtures = 5;

// const data = {
//     input: {
//         kickoffTime,
//         numberOfFixtures,
//     },
// };

// console.log(data);

// const query = ` query GetGameweekPlayers($input: getGameweekPlayers) {
//         getGameweekPlayers(input: $input) {
//           id
//           net_goals
//           own_goals
//           goals
//         }
//       }`;

// const res = await fetchGQL(query, data);

// console.log(res.getGameweekPlayers);

import { parentPort } from 'worker_threads';

const test = async () => {
    const gameWeekId = 9;
    const res = await fetch(
        //// CHANGE THIS TO gameWeekId //// !!!!! //// !!!!!!!!!
        `https://fantasy.premierleague.com/api/event/${gameWeekId}/live/`
    );

    if (!res === 0) {
        throw new Error('Cannot fetch data from EPL API.');
    }

    const data = await res.json();
    console.log(data);
    console.log(data.elements);
    console.log(data.elements.length);

    if (data.elements.length === 0) {
        console.log('EPL gameweek has not started yet.');
        if (parentPort) {
            parentPort.postMessage(
                `Gameweek ${gameWeekId} has not started yet!`
            );
            parentPort.postMessage('done');
        }
    }
};

test();
