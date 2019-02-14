import { StateType } from 'typesafe-actions';

import reducers from 'store/reducers';
import { State as PaymentState } from 'store/payment/reducers';
import { State as JoinState } from 'store/join/reducers';
import { State as NewsState } from 'store/news/reducers';
import { State as SettingsState } from 'store/settings/reducers';
import { State as AuthState } from 'store/auth/reducers';
import { State as FormState } from 'store/form/reducers';

declare module 'Types' {
    export type RootState = {
        auth: AuthState;
        payment: PaymentState;
        news: NewsState;
        settings: SettingsState;
        joi: JoinState;
        form: FormState;
    };
}
