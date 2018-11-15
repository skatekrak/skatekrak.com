import analytics from '@krak/analytics';
import App, { Container } from 'next/app';
import React from 'react';
import withReduxStore from '../hocs/withRedux';
import { Provider } from 'react-redux';

import getPageTitle from 'helpers/pageTitle';
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
        analytics.init('2', {
            cookieDomain: '*.skatekrak.com',
            domains: ['*.skatekrak.com', '*.krakbox.com'],
            crossDomainLinking: true,
        });
        analytics.trackPageView(getPageTitle(document.location.pathname));

        if (window['__NEXT_REDUX_STORE__'] && this.props.router) {
            const { query } = this.props.router;
            if (query.cc && query.cc === 'us') {
                window['__NEXT_REDUX_STORE__'].dispatch(savePricingCurrency(34800, 'usd'));
            }
        }
    }

    render() {
        const { Component, pageProps, reduxStore } = this.props;
        return (
            <Container>
                <Provider store={reduxStore}>
                    <Component {...pageProps} />
                </Provider>
            </Container>
        );
    }
}

export default withReduxStore(MyApp);
