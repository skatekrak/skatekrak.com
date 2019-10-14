import { NextComponentType } from 'next';
import Router from 'next/router';
import React, { Component } from 'react';

import { getBearerFromLocalCookie, getBearerFromServerCookie } from 'lib/auth';

const withAuth = (Page: NextComponentType<any>) =>
    class WithAuth extends Component {
        public static async getInitialProps({ req, res }) {
            const bearer = (process as any).browser ? getBearerFromLocalCookie() : getBearerFromServerCookie(req);
            const pageProps = Page.getInitialProps && Page.getInitialProps(req);
            const isAuthenticated = !!bearer;

            if (isAuthenticated) {
                if (res) {
                    res.writeHead(302, { Location: '/club' });
                } else {
                    Router.push('/club');
                }
            }

            return pageProps;
        }

        public render() {
            return <Page {...this.props} />;
        }
    };

export default withAuth;
