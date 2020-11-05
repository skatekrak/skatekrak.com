import { combineReducers } from 'redux';
import { routerReducer } from 'connected-next-router';
import type { RouterState } from 'connected-next-router/types';

import feed, { State as FeedState } from './feed/reducers';
import settings, { State as SettingsState } from './settings/reducers';
import map, { MapState } from './map/reducers';
import mag, { MagState } from './mag/reducers';

export type RootState = {
    settings: SettingsState;
    news: FeedState;
    video: FeedState;
    mag: MagState;
    map: MapState;
    router: RouterState;
};

const reducers = combineReducers({
    settings,
    news: feed(),
    video: feed(),
    mag,
    map,
    router: routerReducer,
});

export default reducers;
