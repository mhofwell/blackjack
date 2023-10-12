import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    type Query {
        user(id: ID!): User!
        login(pw: String!, fn: String!, ln: String!): User!
        allEntries: [Entry!]!
        entry(id: ID!): Entry!
        playerEntries(id: ID!): [Entry!]!
        pools: [Pool!]!
        pool(id: ID!): Pool!
        allPlayers: [Player!]!
        getGameweekPlayers(input: getGameweekPlayers): [Player!]!
        player(id: ID!): Player!
    }

    type Mutation {
        updateEntry(input: updateEntryInput!): Entry!
        updatePlayer(input: updatePlayerInput!): Player!
    }

    type Subscription {
        entryUpdated: Entry!
        playerUpdated: Player!
        hi: String
    }

    input updateEntryInput {
        id: String!
        goals: Int!
        own_goals: Int!
        net_goals: Int!
    }
    input updatePlayerInput {
        id: Int!
        goals: Int!
        own_goals: Int!
        net_goals: Int!
    }
    input getGameweekPlayers {
        kickoffTime: String!
        numberOfFixtures: Int!
    }

    type Entry {
        id: String!
        players: [Player]!
        suit: Suit!
        goals: Int!
        own_goals: Int!
        net_goals: Int!
        pool: Pool!
        user: User!
        winner: Winner
        standing: Int
    }

    type Player {
        id: Int
        avatar: String
        fn: String!
        ln: String!
        club: Club
        entry: [Entry]
        goals: Int!
        own_goals: Int!
        net_goals: Int!
    }

    type User {
        id: String!
        fn: String!
        ln: String!
        password: String
        team: String
        avatar: String
        entries: [Entry]
        owned_pools: [Pool]
        wins: Int!
        losses: Int!
        ties: Int!
        role: Role!
    }

    type Pool {
        id: String!
        season: Int!
        league: League!
        region: Region!
        name: String!
        owner: User!
        entries: [Entry]
    }

    type Club {
        id: Int!
        name: String!
        logo: String
        players: [Player]
    }

    enum Role {
        USER
        ADMIN
    }

    enum Winner {
        YES
        NO
    }

    enum Suit {
        CLUBS
        SPADES
        DIAMONDS
        HEARTS
    }

    enum Region {
        UK
        CANADA
    }

    enum League {
        EPL
    }
`;

export default typeDefs;
