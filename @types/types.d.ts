import { StateType } from 'typesafe-actions';

import reducers from 'store/reducers';
import { State as PaymentState } from 'store/payment/reducers';
import { State as FeedState } from 'store/feed/reducers';
import { State as SettingsState } from 'store/settings/reducers';
import { State as AuthState } from 'store/auth/reducers';
import { State as FormState } from 'store/form/reducers';

declare module 'Types' {
    export type RootState = {
        auth: AuthState;
        form: FormState;
        payment: PaymentState;
        settings: SettingsState;
        news: FeedState;
        video: FeedState;
        mag: FeedState;
    };
}
