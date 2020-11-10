import { combineReducers } from 'redux';
import { routerReducer } from 'connected-next-router';
import type { RouterState } from 'connected-next-router/types';

import settings, { State as SettingsState } from './settings/reducers';
import map, { MapState } from './map/reducers';
import mag, { MagState } from './mag/reducers';
import news, { NewsState } from './news/reducer';
import videos, { VideosState } from './videos/reducer';

export type RootState = {
    settings: SettingsState;
    news: NewsState;
    video: VideosState;
    mag: MagState;
    map: MapState;
    router: RouterState;
};

const reducers = combineReducers({
    settings,
    news: news,
    video: videos,
    mag,
    map,
    router: routerReducer,
});

export default reducers;
