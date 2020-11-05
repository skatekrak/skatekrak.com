import { Source } from 'rss-feed';
import { action } from 'typesafe-actions';

import { TOGGLE_CATEGORY, SET_MAG_SEARCH, RESET_CATEGORIES } from '../constants';

export const toggleCategory = (source: Source) => action(TOGGLE_CATEGORY, source);
export const setMagSearch = (query: string) => action(SET_MAG_SEARCH, query);
export const resetCategories = () => action(RESET_CATEGORIES);
