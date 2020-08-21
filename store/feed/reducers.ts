import { Language, Source } from 'rss-feed';
import { ActionType } from 'typesafe-actions';

import { FilterState, FilterStateUtil } from 'lib/FilterState';
import LocalStorage from 'lib/LocalStorage';

import {
    FEED_REFRESH_END,
    SEARCH,
    SELECT_ALL_FILTERS,
    SELECT_LANGUAGE,
    SET_ALL_SOURCES,
    SET_ITEMS,
    TOGGLE_FILTER,
    UNSELECT_ALL_FILTERS,
} from '../constants';

import * as feed from './actions';

export type FeedAction = ActionType<typeof feed>;

export type State = {
    feedNeedRefresh: boolean;
    sources: Map<Source, FilterState>;
    languages: Language[];
    search?: string;
    items: any[];
};

const FeedReducers = () => {
    const initialState: State = {
        feedNeedRefresh: false,
        sources: new Map<Source, FilterState>(),
        languages: new Array<Language>(),
        search: undefined,
        items: [],
    };

    return (state: State = initialState, action: FeedAction): State => {
        switch (action.type) {
            case SET_ALL_SOURCES: {
                const sources: Source[] = action.payload;
                const map: Map<Source, FilterState> = new Map();
                const languages: Language[] = [];
                for (const source of sources) {
                    if (LocalStorage.isSourceSelected(source)) {
                        map.set(source, FilterState.LOADING_TO_SELECTED);
                    } else {
                        map.set(source, FilterState.UNSELECTED);
                    }

                    // add language if new
                    if (
                        source.lang &&
                        languages.find((language) => language.isoCode === source.lang.isoCode) === undefined
                    ) {
                        languages.push(source.lang);
                    }
                }
                return {
                    ...state,
                    feedNeedRefresh: true,
                    sources: map,
                    languages,
                };
            }
            case FEED_REFRESH_END: {
                const map: Map<Source, FilterState> = new Map();
                for (const entry of state.sources.entries()) {
                    if (entry[1] === FilterState.LOADING_TO_SELECTED) {
                        map.set(entry[0], FilterState.SELECTED);
                        LocalStorage.saveSourceState(entry[0], true);
                    } else if (entry[1] === FilterState.LOADING_TO_UNSELECTED) {
                        map.set(entry[0], FilterState.UNSELECTED);
                        LocalStorage.saveSourceState(entry[0], false);
                    } else {
                        map.set(entry[0], entry[1]);
                    }
                }
                return {
                    ...state,
                    feedNeedRefresh: false,
                    sources: map,
                };
            }
            case SELECT_ALL_FILTERS: {
                const map: Map<Source, FilterState> = new Map();
                for (const source of state.sources.keys()) {
                    map.set(source, FilterState.LOADING_TO_SELECTED);
                }
                return {
                    ...state,
                    feedNeedRefresh: true,
                    sources: map,
                };
            }
            case SELECT_LANGUAGE: {
                const map: Map<Source, FilterState> = new Map();
                for (const entry of state.sources.entries()) {
                    if (entry[0].lang.isoCode === action.payload.isoCode) {
                        map.set(entry[0], FilterState.LOADING_TO_SELECTED);
                    } else {
                        map.set(entry[0], FilterState.LOADING_TO_UNSELECTED);
                    }
                }
                return {
                    ...state,
                    feedNeedRefresh: true,
                    sources: map,
                };
            }
            case UNSELECT_ALL_FILTERS: {
                const map: Map<Source, FilterState> = new Map();
                for (const source of state.sources.keys()) {
                    map.set(source, FilterState.LOADING_TO_UNSELECTED);
                }
                return {
                    ...state,
                    feedNeedRefresh: true,
                    sources: map,
                };
            }
            case TOGGLE_FILTER: {
                const source: Source = action.payload;
                const filterState = state.sources.get(source);

                const map = new Map(state.sources.entries());
                if (FilterStateUtil.isAllSelected(map.values())) {
                    for (const src of map.keys()) {
                        if (src.id !== source.id) {
                            map.set(src, FilterState.LOADING_TO_UNSELECTED);
                        }
                    }
                    map.set(source, FilterState.LOADING_TO_SELECTED);
                } else if (filterState === FilterState.SELECTED) {
                    map.set(source, FilterState.LOADING_TO_UNSELECTED);
                } else if (filterState === FilterState.UNSELECTED) {
                    map.set(source, FilterState.LOADING_TO_SELECTED);
                }
                if (FilterStateUtil.isAllUnSelected(map.values())) {
                    for (const src of map.keys()) {
                        map.set(src, FilterState.LOADING_TO_SELECTED);
                    }
                }

                return {
                    ...state,
                    feedNeedRefresh: true,
                    sources: map,
                };
            }
            case SEARCH: {
                const search = action.payload !== '' ? action.payload : undefined;
                return {
                    ...state,
                    feedNeedRefresh: true,
                    search,
                };
            }
            case SET_ITEMS: {
                return {
                    ...state,
                    items: action.payload,
                };
            }
            default:
                return state;
        }
    };
};

export default FeedReducers;
