'use client';
import { setVerbosity } from 'ts-invariant';
import { HttpLink, split, ApolloLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import {
    NextSSRApolloClient,
    ApolloNextAppProvider,
    NextSSRInMemoryCache,
    SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const wsLink = new GraphQLWsLink(
    createClient({
        url: 'ws://express-api:8080/graphql',
    })
);

const httpLink = new HttpLink({
    uri: 'http://express-api:8080/graphql',
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
// setVerbosity('debug');

function makeClient() {
    return new NextSSRApolloClient({
        cache: new NextSSRInMemoryCache(),
        link:
            typeof window === 'undefined'
                ? ApolloLink.from([
                      new SSRMultipartLink({
                          stripDefer: true,
                      }),
                      splitLink,
                  ])
                : splitLink,
    });
}

export function ApolloWrapper({ children }) {
    return (
        <ApolloNextAppProvider makeClient={makeClient}>
            {children}
        </ApolloNextAppProvider>
    );
}
