import bodyParser from 'body-parser';
import express from 'express';
import 'dotenv/config';
import cron from 'node-cron';

import getPlayerdata from './utils/epl-connect.js';
import prismaInit from './prisma/ping.js';

// Express server setup
const app = express();
const port = process.env.NODE_PORT || '8090';

// Parse body of incoming requests as JSON data.
app.use(bodyParser.json());

// access control and headers for REST API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*'); // or GET, POST, PUT, PATCH, DELETE
    res.setHeader('Access-Control-Allow-Header', 'Content-Type, Authorization'); // could use a wildcard (*).
    // This says clients can send requests that hold extra authorziation and content types in the header
    next();
});

// graphql middleware
// app.use('/graphql', graphqlHttp({

// }))

/// route req/res error handling for API requests
app.use((err, req, res, next) => {
    console.log(err);
    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;
    res.status(status).json({
        message: message,
        data: data,
    });
});

// EPL cron job to pull player data.
// We'll have to implement websockets here to push updates to the client once goal numbers change for each player.
cron.schedule(
    '*/15 * * * * *',
    function () {
        console.log('---------------------');
        console.log('running a task every 15 seconds');
    },
    {
        scheduled: false,
        timezone: '"America/Vancouver"',
    }
);

// Boot command for server and other systems
const boot = async () => {
    app.listen(port, () => {
        console.log('Server running on port:', port);
    });

    const data = await prismaInit();

    if (data.name !== 'prisma') {
        console.log('Cannot connect to PRISMA');
    } else {
        console.log('Connected to PRISMA!');
    }

    const payload = await getPlayerdata();
    console.log('EPL API connection status:', payload.status);
};

boot();
