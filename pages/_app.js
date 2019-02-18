import App, { Container } from 'next/app';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import Intercom from 'react-intercom';

import withApolloClient from 'hocs/withApollo';
import withReduxStore from 'hocs/withRedux';
import { userSigninSuccess } from 'store/auth/actions';
import { getUserFromLocalCookie, getUserFromServerCookie } from 'lib/auth';

class MyApp extends App {
    static async getInitialProps({ Component, router, ctx }) {
        const authUser = process.browser ? getUserFromLocalCookie() : getUserFromServerCookie(ctx.req);

        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        return {
            ...pageProps,
            authUser,
            isAuthenticated: !!authUser,
        };
    }

    componentDidMount() {
        if (window['__NEXT_REDUX_STORE__']) {
            if (this.props.isAuthenticated) {
                window['__NEXT_REDUX_STORE__'].dispatch(userSigninSuccess(this.props.authUser));
            }
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
                            {this.props.router.route.startsWith('/club') && (
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
