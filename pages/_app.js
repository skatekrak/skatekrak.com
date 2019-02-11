import axios from 'axios';
import App, { Container } from 'next/app';
import React from 'react';
import withReduxStore from '../hocs/withRedux';
import { Provider } from 'react-redux';
import Intercom from 'react-intercom';

import { savePricingCurrency } from 'store/reducers/payment';

class MyApp extends App {
    static async getInitialProps({ Component, router, ctx }) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        return { ...pageProps, countryCode };
    }

    componentDidMount() {
        axios('https://api.ipdata.co/?api-key=4a4e1261ab0b0b8288f5ffef913072c177a0262cf1945fb399a0b712').then(
            (result) => {
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

    render() {
        const { Component, pageProps, reduxStore } = this.props;
        return (
            <Container>
                <Provider store={reduxStore}>
                    <>
                        <Component {...pageProps} />
                        {this.props.router.route.startsWith('/club') && <Intercom appID={process.env.INTERCOM_ID} />}
                    </>
                </Provider>
            </Container>
        );
    }
}

export default withReduxStore(MyApp);
