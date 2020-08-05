import { combineReducers } from 'redux';

import feed from './feed/reducers';
import payment from './payment/reducers';
import settings from './settings/reducers';
import map from './map/reducers';

export default () =>
    combineReducers({
        payment,
        settings,
        news: feed(),
        video: feed(),
        mag: feed(),
        map,
    });
