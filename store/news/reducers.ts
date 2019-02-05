import { Source } from 'rss-feed';
import { ActionType } from 'typesafe-actions';

import LocalStorage from 'lib/LocalStorage';

import {
    FEED_REFRESH_END,
    SELECT_ALL_FILTERS,
    SET_ALL_SOURCES,
    TOGGLE_FILTER,
    UNSELECT_ALL_FILTERS,
} from '../constants';

import * as news from './actions';

export type NewsAction = ActionType<typeof news>;

export enum FilterState {
    SELECTED = 'SELECTED',
    LOADING_TO_SELECTED = 'LOADING_TO_SELECTED',
    LOADING_TO_UNSELECTED = 'LOADING_TO_UNSELECTED',
    UNSELECTED = 'UNSELECTED',
}

export type State = {
    feedNeedRefresh: boolean;
    sources: Map<Source, FilterState>;
};

const initialState: State = {
    feedNeedRefresh: false,
    sources: new Map(),
};

export default (state: State = initialState, action: NewsAction): State => {
    switch (action.type) {
        case SET_ALL_SOURCES: {
            const sources: Source[] = action.payload;
            const map: Map<Source, FilterState> = new Map();
            for (const source of sources) {
                if (LocalStorage.isSourceSelected(source)) {
                    map.set(source, FilterState.LOADING_TO_SELECTED);
                } else {
                    map.set(source, FilterState.UNSELECTED);
                }
            }
            return {
                ...state,
                feedNeedRefresh: true,
                sources: map,
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
        default:
            return state;
    }
};
