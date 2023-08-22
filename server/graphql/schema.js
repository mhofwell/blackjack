import { gql } from 'apollo-server-express';

// graphQL types and resolvers
export const typeDefs = gql`
    type Query {
        hello: String
    }
`;

export default typeDefs;
