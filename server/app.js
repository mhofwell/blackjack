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
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

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

// Constants
import { NODE_PORT } from './config.js';

// env
import 'dotenv/config.js';

// logger
import getLogger from './logging/logger.js';

const logger = getLogger('express');

logger.warn(`Launching in ${process.env.NODE_ENV.toUpperCase()}`);

const schema = makeExecutableSchema({
    typeDefs,
    resolvers: {
        Query,
        Mutation,
        Subscription,
    },
});

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
});

// Create an Express app and HTTP server; attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);

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
    // just added could cause errors
    csrfPrevention: true,
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

const main = async () => {
    // Apollo/GraphQL server start.
    await server.start();

    if (server) {
        logger.info(
            `Apollo/GraphQL API is now live on endpoint: ${NODE_PORT}/graphql`
        );
    } else {
        logger.fatal(`Could not start Apollo/GraphQL API`);
        process.exit(1);
    }

    // Middleware for the express application.
    app.use(
        '/graphql',
        cors(),
        helmet(),
        limiter,
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                return { prisma, pubsub, req };
            },
        })
    );

    app.get('/health', (req, res) => {
        res.status(200).send('Okay!');
    });

    // WS server start
    httpServer.listen(NODE_PORT, () => {
        logger.info(
            `Apollo/GraphQL websocket service is live on endpoint: ${NODE_PORT}/graphql`
        );
    });
};

main();
