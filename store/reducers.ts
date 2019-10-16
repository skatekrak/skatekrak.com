import { combineReducers } from 'redux';

import auth from './auth/reducers';
import feed from './feed/reducers';
import form from './form/reducers';
import payment from './payment/reducers';
import settings from './settings/reducers';

export default () =>
    combineReducers({
        auth,
        form,
        payment,
        settings,
        news: feed(),
        video: feed(),
        mag: feed(),
    });
