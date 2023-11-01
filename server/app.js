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
    path: '/subscription',
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
            `Apollo/GraphQL API is now live on endpoint: ${port}/graphql`
        );
    } else {
        logger.fatal(`Could not start Apollo/GraphQL API`);
        process.exit(1);
    }

    // Middleware for the express application.
    app.use(
        '/graphql',
        cors(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                return { prisma, pubsub, req };
            },
        })
    );
    // WS server start
    httpServer.listen(port, () => {
        logger.info(
            `Apollo/GraphQL websocket service is live on endpoint: ${port}/graphql`
        );
    });

    // Prisma ping.
    const data = await pingPrisma();

    if (data.name !== 'prisma') {
        logger.error('Cannot connect to PRISMA');
    } else {
        logger.info('Connected to PRISMA!');
    }

    // EPL ping.
    const payload = await pingEpl();
    if (payload.status !== 200) {
        logger.info(`EPL API connection status: ${payload.status}`);
        logger.warn('Cannot access EPL servers.');
    } else {
        logger.info(`EPL API connection status: ${payload.status}`);
    }
};

main();
