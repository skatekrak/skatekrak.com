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

        return { pageProps };
    }

    componentDidMount() {
        if (window['__NEXT_REDUX_STORE__'] && this.props.router) {
            const { query } = this.props.router;
            if (query.cc) {
                if (query.cc === 'us') {
                    window['__NEXT_REDUX_STORE__'].dispatch(savePricingCurrency(34800, 'usd'));
                } else if (query.cc === 'gb') {
                    window['__NEXT_REDUX_STORE__'].dispatch(savePricingCurrency(34800, 'gbp'));
                }
            }
        }
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
