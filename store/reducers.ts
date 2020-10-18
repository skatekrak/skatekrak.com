import { combineReducers } from 'redux';
import { routerReducer } from 'connected-next-router';

import feed from './feed/reducers';
import settings from './settings/reducers';
import map from './map/reducers';

const reducers = combineReducers({
    settings,
    news: feed(),
    video: feed(),
    mag: feed(),
    map,
    router: routerReducer,
});

export default reducers;
