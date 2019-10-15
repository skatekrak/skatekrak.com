import axios from 'axios';
import App from 'next/app';
import getConfig from 'next/config';
import React from 'react';
import { Provider } from 'react-redux';

import withReduxStore from 'hocs/withRedux';
import { userSigninSuccess, getMe } from 'store/auth/actions';
import { savePricingCurrency } from 'store/payment/actions';
import { removeUser } from 'lib/auth';

class MyApp extends App {
    componentDidMount() {
        // If not in dev, we query ipdata.co to get country based on IP
        // and show currency accordingly
        if (getConfig().publicRuntimeConfig.NODE_ENV !== 'development') {
            axios('https://api.ipdata.co/?api-key=4a4e1261ab0b0b8288f5ffef913072c177a0262cf1945fb399a0b712').then(
                result => {
                    let countryCode = undefined;
                    if (result.data && result.data.country_code) {
                        countryCode = result.data.country_code.toLowerCase();
                    }
                    // tslint:disable-next-line
                    if (window['__NEXT_REDUX_STORE__'] && countryCode) {
                        if (countryCode === 'us') {
                            // tslint:disable-next-line
                            window['__NEXT_REDUX_STORE__'].dispatch(savePricingCurrency(9900, 'usd'));
                        } else if (countryCode === 'gb') {
                            // tslint:disable-next-line
                            window['__NEXT_REDUX_STORE__'].dispatch(savePricingCurrency(9900, 'gbp'));
                        }
                    }
                },
            );
        }

        // We setup as logged in if we have a cookie
        // tslint:disable-next-line
        if (window['__NEXT_REDUX_STORE__']) {
            if (this.props.isAuthenticated) {
                // tslint:disable-next-line
                window['__NEXT_REDUX_STORE__'].dispatch(userSigninSuccess(this.props.authUser));
            }
        }

        if (this.props.authUser && !this.props.isAuthenticated) {
            removeUser();
        }

        if (this.props.isAuthenticated && !this.props.authUser) {
            // tslint:disable-next-line
            window['__NEXT_REDUX_STORE__'].dispatch(getMe());
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isAuthenticated && !this.props.isAuthenticated) {
            // this.props.apolloClient.resetStore();
        }

        if (this.props.authUser && !this.props.isAuthenticated) {
            removeUser();
        }
    }

    render() {
        const { Component, pageProps, reduxStore, authUser } = this.props;

        const user = {};
        if (authUser) {
            user.email = authUser.email;
            user.user_id = authUser.id;
            user.user_hash = authUser.intercomHmac;
        }

        return (
            <Provider store={reduxStore}>
                <Component {...pageProps} />
            </Provider>
        );
    }
}

export default withReduxStore(MyApp);
