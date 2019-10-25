import App from 'next/app';
import { Provider } from 'react-redux';

import { getOrCreateStore } from 'hocs/withRedux';

const store = getOrCreateStore();

class MyApp extends App {
    store = store;

    render() {
        const { Component, pageProps } = this.props;

        return (
            <Provider store={store}>
                <Component {...pageProps} />
            </Provider>
        );
    }
}

export default MyApp;
