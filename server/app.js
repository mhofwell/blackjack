import bodyParser from 'body-parser';
import express from 'express';
import 'dotenv/config';
import cron from 'node-cron';
import { ApolloServer, gql } from 'apollo-server-express';

import pingEpl from './utils/epl-connect.js';
import prismaInit from './prisma/ping.js';

// Express server setup
const app = express();
const port = process.env.NODE_PORT || '8090';

// graphQL types and resolvers
const typeDefs = gql`
    type Query {
        hello: String
    }
`;

const resolvers = {
    Query: {
        hello: () => 'Hello World!',
    },
};

// Apollo-server configuration for new instance.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Start Apollo-server
await server.start();

// Apply Apollo-sever as middleware
server.applyMiddleware({ app });

// Parse body of incoming requests as JSON data.
app.use(bodyParser.json());

// access control and headers for REST API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*'); // or GET, POST, PUT, PATCH, DELETE
    // This says clients can send requests that hold extra authorziation and content types in the header
    res.setHeader('Access-Control-Allow-Header', 'Content-Type, Authorization'); // could use a wildcard (*).
    next();
});

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

// Boot express server and ping other systems
const boot = async () => {
    app.listen(port, () => {
        console.log(`Server running on port: ${port}`);
    });

    const data = await prismaInit();

    if (data.name !== 'prisma') {
        console.log('Cannot connect to PRISMA');
    } else {
        console.log('Connected to PRISMA!');
    }

    const payload = await pingEpl();
    console.log(`EPL API connection status: ${payload.status}`);
};

boot();
