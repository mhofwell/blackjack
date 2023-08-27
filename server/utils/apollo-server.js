import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';

// GraphQL Resolvers and TypeDefs
import resolvers from '../graphql/resolvers.js';
import typeDefs from '../graphql/schema.js';

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Apollo-server configuration for new instance.
const apolloServer = async () => {
    const server = new ApolloServer({
        schema,
    });
    // Start Apollo-server
    await server.start();
    return server;
};

export default apolloServer;

