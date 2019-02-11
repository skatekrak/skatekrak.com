export const SAVE_PRICING_CURRENCY = 'SAVE_PRICING_CURRENCY';

type State = {
    price: number;
    currency: string;
};

const initialState: State = {
    price: 9900,
    currency: 'eur',
};

export default (state = initialState, action: any = {}) => {
    switch (action.type) {
        case SAVE_PRICING_CURRENCY: {
            return {
                ...state,
                price: action.price,
                currency: action.currency,
            };
        }
        default:
            return state;
    }
};

export const savePricingCurrency = (price: number, currency: string) => ({
    type: SAVE_PRICING_CURRENCY,
    price,
    currency,
});
