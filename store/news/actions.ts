import { Language, Source } from 'rss-feed';
import { action } from 'typesafe-actions';

import {
    FEED_REFRESH_END,
    SELECT_ALL_FILTERS,
    SELECT_LANGUAGE,
    SET_ALL_SOURCES,
    TOGGLE_FILTER,
    UNSELECT_ALL_FILTERS,
} from '../constants';

export const setAllSources = (sources: Source[]) => action(SET_ALL_SOURCES, sources);
export const feedEndRefresh = () => action(FEED_REFRESH_END);
export const selectAllFilters = () => action(SELECT_ALL_FILTERS);
export const unselectAllFilters = () => action(UNSELECT_ALL_FILTERS);
export const toggleFilter = (source: Source) => action(TOGGLE_FILTER, source);
export const selectLanguage = (language: Language) => action(SELECT_LANGUAGE, language);
