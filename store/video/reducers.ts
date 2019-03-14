import { Language, Source } from 'rss-feed';
import { ActionType } from 'typesafe-actions';

import LocalStorage from 'lib/LocalStorage';

import {
    FEED_REFRESH_END,
    SEARCH,
    SELECT_ALL_FILTERS,
    SELECT_LANGUAGE,
    SET_ALL_SOURCES,
    TOGGLE_FILTER,
    UNSELECT_ALL_FILTERS,
} from '../constants';

import * as video from './actions';

export type VideoAction = ActionType<typeof video>;

export enum FilterState {
    SELECTED = 'SELECTED',
    LOADING_TO_SELECTED = 'LOADING_TO_SELECTED',
    LOADING_TO_UNSELECTED = 'LOADING_TO_UNSELECTED',
    UNSELECTED = 'UNSELECTED',
}

export type State = {
    feedNeedRefresh: boolean;
    sources: Map<Source, FilterState>;
    languages: Language[];
    search?: string;
};

const initialState: State = {
    feedNeedRefresh: false,
    sources: new Map<Source, FilterState>(),
    languages: new Array<Language>(),
    search: undefined,
};

export default (state: State = initialState, action: VideoAction): State => {
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
                if (languages.find(language => language.isoCode === source.lang.isoCode) === undefined) {
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
            if (filterState === FilterState.SELECTED) {
                map.set(source, FilterState.LOADING_TO_UNSELECTED);
            } else if (filterState === FilterState.UNSELECTED) {
                map.set(source, FilterState.LOADING_TO_SELECTED);
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
                search,
            };
        }
        default:
            return state;
    }
};
