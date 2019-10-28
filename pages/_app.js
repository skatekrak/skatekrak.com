import App from 'next/app';
import { Provider } from 'react-redux';

import withReduxStore from 'hocs/withRedux';

import RefreshScrollOnNewPage from 'components/Ui/Utils/RefreshScrollOnNewPage';

class MyApp extends App {
    render() {
        const { Component, pageProps, reduxStore } = this.props;

        return (
            <Provider store={reduxStore}>
                <RefreshScrollOnNewPage>
                    <Component {...pageProps} />
                </RefreshScrollOnNewPage>
            </Provider>
        );
    }
}

export default withReduxStore(MyApp);
