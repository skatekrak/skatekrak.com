import { NextComponentType, NextPageContext } from 'next';
import nextCookie from 'next-cookies';
import Router from 'next/router';

const withAuth = (Page: NextComponentType<any>) => {
    const Wrapper: NextComponentType = props => <Page {...props} />;
    Wrapper.getInitialProps = async (ctx: NextPageContext) => {
        const { user } = nextCookie(ctx);

        /**
         * If `ctx.req` is available it means we are on the server
         * if there is no user it means he's not logged in
         */
        if (ctx.req && user) {
            ctx.res.writeHead(302, { Location: '/profile' });
            ctx.res.end();
        }

        if (user) {
            Router.push('/profile');
        }

        const componentProps = Page.getInitialProps && (await Page.getInitialProps(ctx));

        return { ...componentProps, user };
    };

    return Wrapper;
};

export default withAuth;
