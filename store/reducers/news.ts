import { Source } from 'rss-feed';

const SET_ALL_SOURCES = 'SET_ALL_SOURCES';

const FEED_REFRESH_END = 'FEED_REFRESH_END';

const SELECT_ALL_FILTERS = 'SELECT_ALL_FILTERS';

const UNSELECT_ALL_FILTERS = 'UNSELECT_ALL_FILTERS';

const TOGGLE_FILTER = 'TOGGLE_FILTER';

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

export default (state = initialState, action: any = {}) => {
    switch (action.type) {
        case SET_ALL_SOURCES: {
            const sources: Source[] = action.sources;
            const map: Map<Source, FilterState> = new Map();
            for (const source of sources) {
                map.set(source, FilterState.LOADING_TO_SELECTED);
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
                } else if (entry[1] === FilterState.LOADING_TO_UNSELECTED) {
                    map.set(entry[0], FilterState.UNSELECTED);
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
            const source: Source = action.source;
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

export const setAllSources = (sources: Source[]) => ({ type: SET_ALL_SOURCES, sources });

export const feedEndRefresh = () => ({ type: FEED_REFRESH_END });

export const selectAllFilters = () => ({ type: SELECT_ALL_FILTERS });

export const unselectAllFilters = () => ({ type: UNSELECT_ALL_FILTERS });

export const toggleFilter = (source: Source) => ({ type: TOGGLE_FILTER, source });
