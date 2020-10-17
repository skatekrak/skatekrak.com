import { ActionType } from 'typesafe-actions';

import { Types, Status, SpotOverview } from 'lib/carrelageClient';
import { FilterState } from 'lib/FilterState';
import {
    SELECT_ALL_MAP_FILTERS,
    UNSELECT_ALL_MAP_FILTERS,
    TOGGLE_MAP_FILTER,
    MAP_REFRESH_END,
    SELECT_SPOT,
    SET_VIEWPORT,
    SET_SPOT_OVERVIEW,
    SELECT_FULL_SPOT_TAB,
} from '../constants';
import * as mapActions from './actions';
import { ViewportProps } from 'react-map-gl';

export type FullSpotTab = 'info' | 'clips' | 'tips' | 'edito';

export type MapAction = ActionType<typeof mapActions>;

export type MapState = {
    types: Record<Types, FilterState>;
    status: Record<Status, FilterState>;
    selectedSpotId?: string;
    spotOverview?: SpotOverview;
    viewport: Partial<ViewportProps>;
    fullSpotSelectedTab: FullSpotTab;
};

const initialState: MapState = {
    types: {
        [Types.Diy]: FilterState.SELECTED,
        [Types.Park]: FilterState.SELECTED,
        [Types.Private]: FilterState.SELECTED,
        [Types.Shop]: FilterState.SELECTED,
        [Types.Street]: FilterState.SELECTED,
    },
    status: {
        [Status.Active]: FilterState.SELECTED,
        [Status.Wip]: FilterState.SELECTED,
        [Status.Rip]: FilterState.SELECTED,
    },
    selectedSpotId: undefined,
    spotOverview: undefined,
    viewport: {
        latitude: 48.860332,
        longitude: 2.345054,
        zoom: 12,
    },
    fullSpotSelectedTab: 'info',
};

const MapReducers = (state: MapState = initialState, action: MapAction): MapState => {
    switch (action.type) {
        case SELECT_ALL_MAP_FILTERS: {
            return {
                ...state,
                status: initialState.status,
                types: initialState.types,
            };
        }
        case UNSELECT_ALL_MAP_FILTERS: {
            const types = {
                [Types.Diy]: FilterState.UNSELECTED,
                [Types.Park]: FilterState.UNSELECTED,
                [Types.Private]: FilterState.UNSELECTED,
                [Types.Shop]: FilterState.UNSELECTED,
                [Types.Street]: FilterState.UNSELECTED,
            };

            const status = {
                [Status.Active]: FilterState.UNSELECTED,
                [Status.Wip]: FilterState.UNSELECTED,
                [Status.Rip]: FilterState.UNSELECTED,
            };

            return {
                ...state,
                status,
                types,
            };
        }
        case TOGGLE_MAP_FILTER: {
            const newState = Object.assign({}, state);

            const filter = action.payload;

            // Has to cast to an any, otherwise an error is trigger even though it's completely valid
            if (Object.values(Types).includes(filter as any)) {
                const map = Object.assign({}, state.types);
                const filterState = state.types[filter as Types];

                if (filterState === FilterState.SELECTED) {
                    map[filter as Types] = FilterState.LOADING_TO_UNSELECTED;
                } else if (filterState === FilterState.UNSELECTED) {
                    map[filter as Types] = FilterState.LOADING_TO_SELECTED;
                }

                newState.types = map;
            } else if (Object.values(Status).includes(filter as any)) {
                const map = Object.assign({}, state.status);
                const filterState = state.status[filter as Status];

                if (filterState === FilterState.SELECTED) {
                    map[filter as Status] = FilterState.LOADING_TO_UNSELECTED;
                } else if (filterState === FilterState.UNSELECTED) {
                    map[filter as Status] = FilterState.LOADING_TO_SELECTED;
                }

                newState.status = map;
            }
            return newState;
        }
        case MAP_REFRESH_END: {
            const newState = Object.assign({}, state);

            for (const key in newState.status) {
                if (newState.status[key] === FilterState.LOADING_TO_SELECTED) {
                    newState.status[key] = FilterState.SELECTED;
                } else if (newState.status[key] === FilterState.LOADING_TO_UNSELECTED) {
                    newState.status[key] = FilterState.UNSELECTED;
                }
            }

            for (const key in newState.types) {
                if (newState.types[key] === FilterState.LOADING_TO_SELECTED) {
                    newState.types[key] = FilterState.SELECTED;
                } else if (newState.types[key] === FilterState.LOADING_TO_UNSELECTED) {
                    newState.types[key] = FilterState.UNSELECTED;
                }
            }

            return newState;
        }
        case SELECT_SPOT:
            return {
                ...state,
                selectedSpotId: action.payload,
            };
        case SET_SPOT_OVERVIEW:
            return {
                ...state,
                spotOverview: action.payload,
            };
        case SET_VIEWPORT:
            return {
                ...state,
                viewport: action.payload,
            };
        case SELECT_FULL_SPOT_TAB:
            return {
                ...state,
                fullSpotSelectedTab: action.payload ?? 'info',
            };
        default:
            return state;
    }
};

export default MapReducers;
