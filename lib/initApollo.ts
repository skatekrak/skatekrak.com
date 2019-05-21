import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from 'apollo-boost';
import fetch from 'isomorphic-unfetch';
import getConfig from 'next/config';

let apolloClient: ApolloClient<NormalizedCacheObject> = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
    global.fetch = fetch;
}

function create(initialState?: any): ApolloClient<NormalizedCacheObject> {
    return new ApolloClient({
        connectToDevTools: process.browser,
        ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
        link: new HttpLink({
            uri: getConfig().publicRuntimeConfig.SESTERCES_URL,
            credentials: 'include',
        }),
        cache: new InMemoryCache().restore(initialState || {}),
    });
}

export default function initApollo(initialState?): ApolloClient<NormalizedCacheObject> {
    // Make sure to create a new client for every server-side request so that data
    // isn't shared between connections (which would be bad)
    if (!process.browser) {
        return create(initialState);
    }

    // Reuse client on the client-side
    if (!apolloClient) {
        apolloClient = create(initialState);
    }

    return apolloClient;
}
