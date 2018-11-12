import React from 'react';

import store from '../store';

const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

function getOrCreateStore() {
    if (isServer) {
        return store;
    }

    if (!window[__NEXT_REDUX_STORE__]) {
        window[__NEXT_REDUX_STORE__] = store;
    }
    return window[__NEXT_REDUX_STORE__];
}

export default (App) => {
    return class AppWithRedux extends React.Component {
        static async getInitialProps(appContext) {
            const reduxStore = getOrCreateStore();

            appContext.ctx.reduxStore = reduxStore;

            let appProps = {};
            if (typeof App.getInitialProps === 'function') {
                appProps = await App.getInitialProps(appContext);
            }

            return {
                ...appProps,
                initialReduxState: reduxStore.getState(),
            };
        }

        constructor(props) {
            super(props);
            this.reduxStore = getOrCreateStore(props.initialReduxState);
        }

        render() {
            return <App {...this.props} reduxStore={this.reduxStore} />;
        }
    };
};
