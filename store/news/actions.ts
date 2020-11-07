import { Source } from 'rss-feed';
import { action } from 'typesafe-actions';

import { SELECT_NEWS_SOURCES, TOGGLE_NEWS_SOURCE, RESET_NEWS, SET_NEWS_SEARCH } from '../constants';

export const selectNewsSources = (sources: Source[]) => action(SELECT_NEWS_SOURCES, sources);
export const toggleNewsSource = (source: Source) => action(TOGGLE_NEWS_SOURCE, source);
export const setNewsSearch = (query: string) => action(SET_NEWS_SEARCH, query, { pushToUrl: { query } });
export const resetNews = () => action(RESET_NEWS);
