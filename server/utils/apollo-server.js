import { ApolloServer } from 'apollo-server-express';

// GraphQL Resolvers and TypeDefs
import resolvers from '../graphql/resolvers.js';
import typeDefs from '../graphql/schema.js';

// Apollo-server configuration for new instance.
const apolloServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });
    // Start Apollo-server
    await server.start();
    return server;
};

export default apolloServer;

