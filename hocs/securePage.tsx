import { NextComponentClass } from 'next';
import Router from 'next/router';
import { Component } from 'react';

import defaultPage, { AuthProps } from 'hocs/defaultPage';

const securePageHoc = (Page: NextComponentClass) =>
    class SecurePage extends Component<AuthProps> {
        public static getInitialProps(ctx) {
            return Page.getInitialProps && Page.getInitialProps(ctx);
        }

        public componentDidMount() {
            if (!this.props.isAuthenticated) {
                Router.push('/auth/login');
            }
        }

        public render() {
            const { isAuthenticated } = this.props;
            if (isAuthenticated) {
                return <Page {...this.props} />;
            }
            return <div>Not authorised</div>;
        }
    };

export default (Page: NextComponentClass) => defaultPage(securePageHoc(Page));
