import { combineReducers } from 'redux';

import feed from './feed/reducers';
import form from './form/reducers';
import payment from './payment/reducers';
import settings from './settings/reducers';

export default () =>
    combineReducers({
        form,
        payment,
        settings,
        news: feed(),
        video: feed(),
        mag: feed(),
    });
