import { action } from 'typesafe-actions';

import {
    GET_ME,
    HIDE_MESSAGE,
    ON_HIDE_LOADER,
    ON_SHOW_LOADER,
    SHOW_MESSAGE,
    SIGNIN_USER,
    SIGNIN_USER_SUCCESS,
    SIGNOUT_USER,
    SIGNOUT_USER_SUCCESS,
} from '../constants';

export const userSignin = (email: string, password: string, rememberMe: boolean) =>
    action(SIGNIN_USER, { email, password, rememberMe });
export const userSigninSuccess = (user: any) => action(SIGNIN_USER_SUCCESS, user);
export const userSignout = () => action(SIGNOUT_USER);
export const userSignoutSuccess = () => action(SIGNOUT_USER_SUCCESS);
export const showMessage = (message: string) => action(SHOW_MESSAGE, message);
export const showAuthLoader = () => action(ON_SHOW_LOADER);
export const hideAuthLoader = () => action(ON_HIDE_LOADER);
export const hideMessage = () => action(HIDE_MESSAGE);
export const getMe = () => action(GET_ME);
