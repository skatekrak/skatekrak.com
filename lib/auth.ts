import cookie from 'js-cookie';
import { NextPageContext } from 'next';
import nextCookie from 'next-cookies';
import Router from 'next/router';

export const setUser = (user: any) => {
    if (!(process as any).browser) {
        return;
    }

    cookie.set('user', JSON.stringify(user));
    Router.push('/club/profile');
};

export const removeUser = () => {
    if (!(process as any).browser) {
        return;
    }

    cookie.remove('user');
    Router.push('/auth/login');
};
