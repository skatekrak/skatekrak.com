import { combineReducers } from 'redux';
import { routerReducer } from 'connected-next-router';
import type { RouterState } from 'connected-next-router/types';

import feed, { State as FeedState } from './feed/reducers';
import settings, { State as SettingsState } from './settings/reducers';
import map, { MapState } from './map/reducers';

export type RootState = {
    settings: SettingsState;
    news: FeedState;
    video: FeedState;
    mag: FeedState;
    map: MapState;
    router: RouterState;
};

const reducers = combineReducers({
    settings,
    news: feed(),
    video: feed(),
    mag: feed(),
    map,
    router: routerReducer,
});

export default reducers;
