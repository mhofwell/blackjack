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

import { API_URL_STRING, WS_URL_STRING } from '@/config.js';

console.log('API', API_URL_STRING);
console.log('WS', WS_URL_STRING);

const wsLink = new GraphQLWsLink(
    createClient({
        url: WS_URL_STRING,
    })
);

const httpLink = new HttpLink({
    uri: API_URL_STRING,
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
