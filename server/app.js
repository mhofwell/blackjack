// node server
import express from 'express';
import { createServer } from 'http';

// websockets
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';

// middleware
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';

// redis
import pubsub from './utils/redis/pubsub.js';

// databse
import prisma from './prisma/client.js';

// API
import Query from './graphql/resolvers/Query.js';
import Mutation from './graphql/resolvers/Mutation.js';
import Subscription from './graphql/resolvers/Subscription.js';
import typeDefs from './graphql/typeDefs.js';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServer } from '@apollo/server';

// utils
import { pingPrisma, pingEpl } from './utils/services.js';

// logger
import pino from 'pino-http';
import getLogger from './logging/logger.js';

const logger = getLogger('express');

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
const wsServerCleanup = useServer(
    {
        schema,
        context: async (ctx, msg, args) => {
            return { pubsub };
        },
    },
    wsServer
);

// Create ApolloServer.
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
                        await wsServerCleanup.dispose();
                    },
                };
            },
        },
    ],
});

// Apollo/GraphQL server start.
await server.start();

// Middleware for the express application.
app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
        context: () => {
            return { prisma, pubsub };
        },
    })
);

app.use(pino);

const main = async () => {
    httpServer.listen(port, () => {
        console.log(
            `Server is now running on http://localhost:${port}/graphql`
        );
    });

    const data = await pingPrisma();

    if (data.name !== 'prisma') {
        console.error('Cannot connect to PRISMA');
    } else {
        console.log('Connected to PRISMA!');
    }

    const payload = await pingEpl();
    if (payload.status !== 200) {
        console.log(`EPL API connection status: ${payload.status}`);
        console.error('Cannot access EPL servers.');
    } else {
        console.log(`EPL API connection status: ${payload.status}`);
    }
};

main();
