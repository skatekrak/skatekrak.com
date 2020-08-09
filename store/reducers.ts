import { combineReducers } from 'redux';

import feed from './feed/reducers';
import settings from './settings/reducers';
import map from './map/reducers';

const reducers = () =>
    combineReducers({
        settings,
        news: feed(),
        video: feed(),
        mag: feed(),
        map,
    });

export default reducers;
