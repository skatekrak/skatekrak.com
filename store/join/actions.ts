import { action } from 'typesafe-actions';

import { RESET_JOIN, SET_ACCOUNT, SET_SHIPPING, SET_STRIPE_TOKEN } from '../constants';

export const setAccount = (account: { firstName: string; lastName: string; email: string; password: string }) =>
    action(SET_ACCOUNT, account);
export const setShipping = (address: {
    firstName: string;
    lastName: string;
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    state?: string;
    country: string;
}) => action(SET_SHIPPING, address);
export const setStripeToken = (stripeToken: string) => action(SET_STRIPE_TOKEN, stripeToken);
export const resetJoin = () => action(RESET_JOIN);
