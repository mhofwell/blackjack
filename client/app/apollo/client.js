// lib/client.js
import { HttpLink, split } from '@apollo/client';
import {
    NextSSRInMemoryCache,
    NextSSRApolloClient,
} from '@apollo/experimental-nextjs-app-support/ssr';
import { getMainDefinition } from '@apollo/client/utilities';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

// Global constants.

import { API_URL, WS_URL } from '@/config.js';

const wsLink = new GraphQLWsLink(
    createClient({
        url: 'wss://api-production-9332.up.railway.app/graphql',
    })
);

const httpLink = new HttpLink({
    uri: 'https://api-production-9332.up.railway.app/graphql',
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink
);

export const { getClient } = registerApolloClient(() => {
    return new NextSSRApolloClient({
        cache: new NextSSRInMemoryCache(),
        link: splitLink,
    });
});
