// node server
import express from 'express';
import { createServer } from 'http';

// websockets
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';

// middleware
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
// import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';

// test services
import { pingRedis } from './utils/services.js';

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

// logger
import getLogger from './logging/logger.js';
const logger = getLogger('express');

// constants
import { PORT, API_PRIVATE_URL } from './config.js';

// env
import dotenv from 'dotenv';
dotenv.config();

logger.warn(`Launching in ${process.env.NODE_ENV.toUpperCase()}`);

const schema = makeExecutableSchema({
    typeDefs,
    resolvers: {
        Query,
        Mutation,
        Subscription,
    },
});

let limiter;

if (process.env.NODE_ENV === 'development') {
    limiter = rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 100000,
    });
} else {
    limiter = rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 20,
    });
}

// create the express application.
const app = express();

// set the number of proxies between server and user.
app.set('trust proxy', 1);

// Proxy test endpoint.
app.get('/ip', (request, response) => response.send(request.ip));

const httpServer = createServer(app);

// Create WebSocket server.
const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
});

// Save returned server's info so we can shutdown this server later.
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
    introspection: true,
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

// const corsConfig = {
//     origin: [
//         'https://client.railway.internal',
//         'https://client-development.up.railway.app',
//         'https://epl-blackjack.up.railway.app',
//         'http://localhost:*',
//     ],
// };

const main = async () => {
    // Apollo/GraphQL server start
    await server.start();

    if (server) {
        logger.info(
            `Apollo/GraphQL API is now live on endpoint: ${API_PRIVATE_URL}:${PORT}/graphql`
        );
    } else {
        logger.fatal(`Could not start Apollo/GraphQL API`);
        process.exit(1);
    }

    // Middleware for the express application.
    app.use(
        '/graphql',
        // cors(corsConfig),
        // helmet(),
        limiter,
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                return { prisma, pubsub, req };
            },
        })
    );
    app.get('/health', (req, res) => {
        res.status(200).send('API is healthy!');
    });

    const hostname = '::';

    // http server start
    httpServer.listen(PORT, hostname, () => {
        logger.info(
            `Apollo/GraphQL websocket service is live on endpoint: ${API_PRIVATE_URL}:${PORT}/graphql`
        );
    });

    setTimeout(() => {
        pingRedis();
    }, 500);
};

main();
