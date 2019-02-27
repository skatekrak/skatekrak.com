import axios from 'axios';
import App, { Container } from 'next/app';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import Intercom from 'react-intercom';

import withApolloClient from 'hocs/withApollo';
import withReduxStore from 'hocs/withRedux';
import { userSigninSuccess, getMe } from 'store/auth/actions';
import { savePricingCurrency } from 'store/payment/actions';
import {
    removeUser,
    getBearerFromLocalCookie,
    getBearerFromServerCookie,
    getUserFromLocalCookie,
    getUserFromServerCookie,
} from 'lib/auth';

class MyApp extends App {
    static async getInitialProps({ Component, router, ctx }) {
        const authUser = process.browser ? getUserFromLocalCookie() : getUserFromServerCookie(ctx.req);
        const bearer = process.browser ? getBearerFromLocalCookie() : getBearerFromServerCookie(ctx.req);

        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        return {
            ...pageProps,
            authUser,
            isAuthenticated: !!bearer,
        };
    }

    componentDidMount() {
        // If not in dev, we query ipdata.co to get country based on IP
        // and show currency accordingly
        if (process.env.NODE_ENV !== 'development') {
            axios('https://api.ipdata.co/?api-key=4a4e1261ab0b0b8288f5ffef913072c177a0262cf1945fb399a0b712').then(
                result => {
                    let countryCode = undefined;
                    if (result.data && result.data.country_code) {
                        countryCode = result.data.country_code.toLowerCase();
                    }
                    if (window['__NEXT_REDUX_STORE__'] && countryCode) {
                        if (countryCode === 'us') {
                            window['__NEXT_REDUX_STORE__'].dispatch(savePricingCurrency(9900, 'usd'));
                        } else if (countryCode === 'gb') {
                            window['__NEXT_REDUX_STORE__'].dispatch(savePricingCurrency(9900, 'gbp'));
                        }
                    }
                },
            );
        }

        // We setup as logged in if we have a cookie
        if (window['__NEXT_REDUX_STORE__']) {
            if (this.props.isAuthenticated) {
                window['__NEXT_REDUX_STORE__'].dispatch(userSigninSuccess(this.props.authUser));
            }
        }

        if (this.props.authUser && !this.props.isAuthenticated) {
            removeUser();
        }

        if (this.props.isAuthenticated && !this.props.authUser) {
            window['__NEXT_REDUX_STORE__'].dispatch(getMe());
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isAuthenticated && !this.props.isAuthenticated) {
            this.props.apolloClient.resetStore();
        }

        if (this.props.authUser && !this.props.isAuthenticated) {
            removeUser();
        }
    }

    render() {
        const { Component, pageProps, reduxStore, apolloClient, authUser } = this.props;

        const user = {};
        if (authUser) {
            user.email = authUser.email;
            user.user_id = authUser.id;
            user.user_hash = authUser.intercomHmac;
        }

        return (
            <Container>
                <Provider store={reduxStore}>
                    <ApolloProvider client={apolloClient}>
                        <>
                            <Component {...pageProps} />
                            {(this.props.router.route.startsWith('/club') ||
                                this.props.router.route.startsWith('/auth')) && (
                                <Intercom appID={process.env.INTERCOM_ID} {...user} />
                            )}
                        </>
                    </ApolloProvider>
                </Provider>
            </Container>
        );
    }
}

export default withReduxStore(withApolloClient(MyApp));
