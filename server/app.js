import bodyParser from 'body-parser';
import express from 'express';
import 'dotenv/config';

// Functions to ping services
import { pingEpl, pingPrisma } from './utils/ping-services.js';

// Apollo-server
import apolloServer from './utils/apollo-server.js';

// Express server setup
const app = express();
const port = process.env.NODE_PORT || '8090';

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

// Start apollo-server
const server = await apolloServer();

// Apply Apollo-sever as middleware
server.applyMiddleware({ app, path: '/graphql' });

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

// Boot express server and ping other systems
const boot = async () => {
    app.listen(port, () => {
        console.log(`Express server running on port: ${port}`);
    });

    const data = await pingPrisma();

    if (data.name !== 'prisma') {
        console.log('Cannot connect to PRISMA');
    } else {
        console.log('Connected to PRISMA!');
    }

    const payload = await pingEpl();
    console.log(`EPL API connection status: ${payload.status}`);
};

boot();
