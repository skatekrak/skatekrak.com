import Cookie from 'cookie';
import Cookies from 'js-cookie';

export const setUser = (user: any) => {
    if (!(process as any).browser) {
        return;
    }

    Cookies.set('user', JSON.stringify(user));
};

export const removeUser = () => {
    if (!(process as any).browser) {
        return;
    }

    Cookies.remove('user');
};

export const getUserFromServerCookie = (req: any) => {
    if (!req.headers.cookie || '') {
        return undefined;
    }
    const cookie = Cookie.parse(req.headers.cookie);
    const stringUser = cookie.user ? JSON.parse(cookie.user) : undefined;
    return stringUser;
};

export const getUserFromLocalCookie = () => {
    return Cookies.getJSON('user');
};
