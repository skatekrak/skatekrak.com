import { Component } from 'react';

import { getUserFromLocalCookie, getUserFromServerCookie } from 'lib/auth';
import { NextComponentClass } from 'next';

export type AuthProps = {
    loggedUser: any;
    isAuthenticated: boolean;
};

export default (Page: NextComponentClass) =>
    class DefaultPage extends Component {
        public static async getInitialProps({ req }) {
            const loggedUser = (process as any).browser ? getUserFromLocalCookie() : getUserFromServerCookie(req);
            const pageProps = Page.getInitialProps && Page.getInitialProps(req);
            return {
                ...pageProps,
                loggedUser,
                isAuthenticated: !!loggedUser,
            };
        }

        public render() {
            return <Page {...this.props} />;
        }
    };
