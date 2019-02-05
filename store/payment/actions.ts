import { action } from 'typesafe-actions';

import { SAVE_PRICING_CURRENCY } from '../constants';

export const savePricingCurrency = (price: number, currency: string) =>
    action(SAVE_PRICING_CURRENCY, { price, currency });
