import { Source } from 'rss-feed';
import { action } from 'typesafe-actions';

import { TOGGLE_VIDEOS_SOURCE, SELECT_VIDEOS_SOURCES, SET_VIDEOS_SEARCH, RESET_VIDEOS } from '../constants';

export const toggleVideosSource = (source: Source) => action(TOGGLE_VIDEOS_SOURCE, source);
export const selectVideosSources = (sources: Source[]) => action(SELECT_VIDEOS_SOURCES, sources);
export const setVideosSearch = (query: string) => action(SET_VIDEOS_SEARCH, query);
export const resetVideos = () => action(RESET_VIDEOS);
