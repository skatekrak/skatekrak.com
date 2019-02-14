import { ActionType } from 'typesafe-actions';

import { RESET_JOIN, SET_ACCOUNT, SET_SHIPPING, SET_STRIPE_TOKEN } from '../constants';

import * as join from './actions';

export type JoinAction = ActionType<typeof join>;

export type State = {
    account?: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    };
    shippingAddress?: {
        firstName: string;
        lastName: string;
        line1: string;
        line2?: string;
        city: string;
        postalCode: string;
        country: string;
        state?: string;
    };
    stripeToken?: string;
};

const initialState: State = {
    account: undefined,
    shippingAddress: undefined,
    stripeToken: undefined,
};

export default (state: State = initialState, action: JoinAction): State => {
    switch (action.type) {
        case SET_ACCOUNT:
            return {
                ...state,
                account: action.payload,
            };
        case SET_SHIPPING: {
            return {
                ...state,
                shippingAddress: action.payload,
            };
        }
        case SET_STRIPE_TOKEN: {
            return {
                ...state,
                stripeToken: action.payload,
            };
        }
        case RESET_JOIN: {
            return {
                account: undefined,
                shippingAddress: undefined,
                stripeToken: undefined,
            };
        }
        default:
            return state;
    }
};
