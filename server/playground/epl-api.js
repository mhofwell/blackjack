import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const test = async () => {

};

test();

// Cron job rests on the server, we set up subscriptions to handle the appearance of 'live data' 

// Sunday we pull in the data required for the upcoming gameweek (DONE)

// TO DO
// Get time of all upcoming gameweek games. Set cron job to run at the start of each game. 0 = gameTime - nowTime 

// Player update cron runs every 2 minutes. 

// Search for PlayerIds in live data player array. 

// select goals, own_goals 

// if goals (x), own_goals (y) > 0, update player and entry with mutation. Record x, y. 

// Next query; if x, y change, update player and entry records with mutations. 

