import { ActionType } from 'typesafe-actions';

import {
    HIDE_MESSAGE,
    ON_HIDE_LOADER,
    ON_SHOW_LOADER,
    SHOW_MESSAGE,
    SIGNIN_USER_SUCCESS,
    SIGNOUT_USER_SUCCESS,
} from '../constants';

import * as auth from './actions';

export type AuthAction = ActionType<typeof auth>;

// tslint:disable:interface-over-type-literal
export type User = {
    updatedAt: string;
    createdAt: string;
    email: string;
    username: string;
    installations: any[];
    welcomeMailSent: boolean;
    emailVerified: boolean;
    role: string;
    className: string;
    id: string;
};
// tslint:enable:interface-over-type-literal

export type State = {
    loader: boolean;
    alertMessage: string;
    showMessage: boolean;
    initURL: string;
    authUser: User | null;
};

const initialState: State = {
    alertMessage: '',
    authUser: null,
    initURL: '',
    loader: false,
    showMessage: false,
};

export default (state: State = initialState, action: AuthAction): State => {
    switch (action.type) {
        case SIGNIN_USER_SUCCESS:
            return {
                ...state,
                authUser: action.payload,
                loader: false,
            };
        case SIGNOUT_USER_SUCCESS:
            return {
                ...state,
                authUser: null,
                initURL: '/',
                loader: false,
            };
        case SHOW_MESSAGE:
            return {
                ...state,
                alertMessage: action.payload,
                loader: false,
                showMessage: true,
            };
        case HIDE_MESSAGE:
            return {
                ...state,
                alertMessage: '',
                loader: false,
                showMessage: false,
            };
        case ON_SHOW_LOADER:
            return {
                ...state,
                loader: true,
            };
        case ON_HIDE_LOADER:
            return {
                ...state,
                loader: false,
            };
        default:
            return state;
    }
};
