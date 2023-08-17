import bodyParser from 'body-parser';
import express from 'express';
import 'dotenv/config';

import getPlayerdata from './utils/epl-utils.js';
import prismaInit from './prisma/prisma-connect.js';

// Express server setup
const app = express();
const port = process.env.NODE_PORT || '3000';

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
