// let res = await fetch(
//     'https://fantasy.premierleague.com/api/fixtures?future=1'
// );

// if (!res) {
//     throw new Error(
//         `${inputKT} > Cannot fetch upcoming fixture information from EPL API, check connection.`
//     );
// }
// const n = 11;

// let data = await res.json();

// const weeklyFixtures = data.slice(0, n - 1);

// await weeklyFixtures.forEach((fixture) => {
//     console.log(fixture.kickoff_time);
//     console.log('time', new Date(fixture.kickoff_time));
// });

// import cron from 'cron-validate'

// const cronResult = cron('0 16 * * 4')
// if (cronResult.isValid()) {
//   const validValue = cronResult.getValue()

//   // The valid value is a object containing all cron fields
//   console.log(validValue)
//   // In this case, it would be:
//   // { seconds: undefined, minutes: '*', hours: '*', daysOfMonth: '*', months: '*', daysOfWeek: '*', years: undefiend }
// } else {
//   const errorValue = cronResult.getError()

//   // The error value contains an array of strings, which represent the cron validation errors.
//   console.log(errorValue) // string[] of error messages
// }

// const d = new Date('2023-11-04T12:30:00Z');

// // import moment from 'moment';

// // const a = moment('2023-11-04T12:30:00Z').toDate();

// import dayjs from 'dayjs';

// const a = dayjs('2023-11-04T12:30:00Z').toDate();
// console.log(a);
// console.log(d);

import path from 'path';

const basePath = path.resolve('./jobs/update-player-data.js');

console.log(basePath);
