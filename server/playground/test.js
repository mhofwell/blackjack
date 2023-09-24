
import Bree from 'bree';
import Graceful from '@ladjs/graceful';

const cron = new Bree({
    jobs: [
        {
            name: 'sunday',
            interval: 'every 10 seconds',
        },
    ],
});

// handle graceful reloads, pm2 support, and events like SIGHUP, SIGINT, etc.
const graceful = new Graceful({ brees: [cron] });
graceful.listen();

// start all jobs (this is the equivalent of reloading a crontab):
(async () => {
    await cron.start();
})();

// };

// test();

// Cron job rests on the server, we set up subscriptions to handle the appearance of 'live data'

// Sunday we pull in the data required for the upcoming gameweek (DONE)

// TO DO
// Get time of all upcoming gameweek games. Set cron job to run at the start of each game. 0 = gameTime - nowTime

// Player update cron runs every 2 minutes.

// Search for PlayerIds in live data player array.

// select goals, own_goals

// if goals (x), own_goals (y) > 0, update player and entry with mutation. Record x, y.

// Next query; if x, y change, update player and entry records with mutations.

// new cron job sequence

// Sunday job runs, stores kickoff times in database. Emits event(?) to kickoff job2.

// Job 2: Takes in all kickoff times, forEach kickoff time create a new job and push it into the Bree jobs array?

// Each new job fires at the kickoff time and runs every two minutes in an interval.
