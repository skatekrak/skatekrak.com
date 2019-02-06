import { NextComponentClass } from 'next';
import Router from 'next/router';
import React, { Component } from 'react';

import { getUserFromLocalCookie, getUserFromServerCookie } from 'lib/auth';

const withAuth = (Page: NextComponentClass) =>
    class WithAuth extends Component {
        public static async getInitialProps({ req, res }) {
            const authUser = (process as any).browser ? getUserFromLocalCookie() : getUserFromServerCookie(req);
            const pageProps = Page.getInitialProps && Page.getInitialProps(req);
            const isAuthenticated = !!authUser;

            if (!isAuthenticated) {
                if (res) {
                    res.writeHead(302, { Location: '/auth/login' });
                } else {
                    Router.push('/auth/login');
                }
            }

            return pageProps;
        }

        public render() {
            return <Page {...this.props} />;
        }
    };

export default withAuth;
