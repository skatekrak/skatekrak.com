import { ActionType } from 'typesafe-actions';

import { SAVE_PRICING_CURRENCY } from '../constants';

import * as payment from './actions';

export type PaymentAction = ActionType<typeof payment>;

export type State = {
    price: number;
    currency: string;
};

const initialState: State = {
    price: 8700,
    currency: 'eur',
};

export default (state: State = initialState, action: PaymentAction): State => {
    switch (action.type) {
        case SAVE_PRICING_CURRENCY:
            return {
                ...state,
                price: action.payload.price,
                currency: action.payload.currency,
            };
        default:
            return state;
    }
};
