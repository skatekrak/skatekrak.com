import { combineReducers } from 'redux';
import { routerReducer } from 'connected-next-router';
import type { RouterState } from 'connected-next-router/types';

import feed, { State as FeedState } from './feed/reducers';
import settings, { State as SettingsState } from './settings/reducers';
import map, { MapState } from './map/reducers';
import mag, { MagState } from './mag/reducers';
import news, { NewsState } from './news/reducer';

export type RootState = {
    settings: SettingsState;
    news: NewsState;
    video: FeedState;
    mag: MagState;
    map: MapState;
    router: RouterState;
};

const reducers = combineReducers({
    settings,
    news: news,
    video: feed(),
    mag,
    map,
    router: routerReducer,
});

export default reducers;
