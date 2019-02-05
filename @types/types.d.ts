import { StateType } from 'typesafe-actions';

import reducers from 'store/reducers';
import { State as PaymentState } from 'store/payment/reducers';
import { State as NewsState } from 'store/news/reducers';
import { State as SettingsState } from 'store/settings/reducers';

declare module 'Types' {
    export type RootState = {
        payment: PaymentState;
        news: NewsState;
        settings: SettingsState;
    };
}
