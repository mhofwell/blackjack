import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';
import express from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import bodyParser from 'body-parser';
import cors from 'cors';
import typeDefs from './graphql/typeDefs.js';
import Query from './graphql/resolvers/Query.js';
import Mutation from './graphql/resolvers/Mutation.js';
import Subscription from './graphql/resolvers/Subscription.js';
import { PrismaClient } from '@prisma/client';
import { RedisPubSub } from 'graphql-redis-subscriptions';

// utils
import { pingPrisma, pingEpl } from './utils/services.js';

// Create the schema, this will be used separately by ApolloServer and
// the WebSocket server.

const prisma = new PrismaClient();
const pubsub = new RedisPubSub();

const schema = makeExecutableSchema({
    typeDefs,
    resolvers: {
        Query,
        Mutation,
        Subscription,
    },
});

// Create an Express app and HTTP server; attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);
const port = process.env.NODE_PORT || '8090';

// Create WebSocket server using the HTTP server we just set up.
const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
});

// Save returned server's info so we can shutdown this server later
const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
const server = new ApolloServer({
    schema,
    plugins: [
        // Proper shutdown for the HTTP server.
        ApolloServerPluginDrainHttpServer({ httpServer }),

        // Proper shutdown for the WebSocket server.
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ],
});

await server.start();

app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
        context: () => {
            return {
                prisma,
                pubsub,
            };
        },
    })
);

const main = async () => {
    httpServer.listen(port, () => {
        console.log(
            `Server is now running on http://localhost:${port}/graphql`
        );
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

main();

// access control and headers for REST API
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', '*'); // or GET, POST, PUT, PATCH, DELETE
//     // This says clients can send requests that hold extra authorziation and content types in the header
//     res.setHeader('Access-Control-Allow-Header', 'Content-Type, Authorization'); // could use a wildcard (*).
//     next();
// });

// /// route req/res error handling for API requests
// app.use((err, req, res, next) => {
//     console.log(err);
//     const status = err.statusCode || 500;
//     const message = err.message;
//     const data = err.data;
//     res.status(status).json({
//         message: message,
//         data: data,
//     });
// });
