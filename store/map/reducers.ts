import { ActionType } from 'typesafe-actions';

import { Types, Status, SpotOverview } from 'lib/carrelageClient';
import { FilterState } from 'lib/FilterState';
import {
    SELECT_ALL_MAP_FILTERS,
    UNSELECT_ALL_MAP_FILTERS,
    TOGGLE_MAP_FILTER,
    MAP_REFRESH_END,
    SET_VIEWPORT,
    SET_SPOT_OVERVIEW,
    SELECT_FULL_SPOT_TAB,
    SELECT_SPOT,
    TOGGLE_SPOT_MODAL,
    TOGGLE_CUSTOM_MAP,
    SET_VIDEO_PLAYING,
    TOGGLE_LEGEND,
    UPDATE_URL_PARAM,
} from './constants';
import * as mapActions from './actions';
import type { ViewportProps } from 'react-map-gl';

export type FullSpotTab =
    | 'info'
    | 'clips'
    | 'tips'
    | 'edito'
    | 'media'
    | 'contests'
    | 'events'
    | 'instagram'
    | 'contributors';

export type MapAction = ActionType<typeof mapActions>;

export type MapState = {
    types: Record<Types, FilterState>;
    status: Record<Status, FilterState>;
    spotOverview?: SpotOverview;
    viewport: Partial<ViewportProps>;
    fullSpotSelectedTab: FullSpotTab;
    selectSpot?: string;
    modalVisible: boolean;
    legendOpen: boolean;
    customMapId?: string;
    videoPlayingId?: string;
};

export const initialState: MapState = {
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
    viewport: {
        latitude: 48.860332,
        longitude: 2.345054,
        zoom: 12,
    },
    spotOverview: undefined,
    selectSpot: undefined,
    modalVisible: false,
    legendOpen: false,
    customMapId: undefined,
    fullSpotSelectedTab: 'media',
    videoPlayingId: undefined,
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
        case SET_SPOT_OVERVIEW:
            return {
                ...state,
                spotOverview: action.payload,
            };
        case SET_VIEWPORT:
            return {
                ...state,
                viewport: {
                    ...state.viewport,
                    ...action.payload,
                },
            };
        case SELECT_FULL_SPOT_TAB:
            return {
                ...state,
                fullSpotSelectedTab: action.payload ?? initialState.fullSpotSelectedTab,
            };
        case SELECT_SPOT:
            return {
                ...state,
                selectSpot: action.payload,
            };
        case TOGGLE_SPOT_MODAL:
            return {
                ...state,
                modalVisible: action.payload,
            };
        case TOGGLE_LEGEND:
            return {
                ...state,
                legendOpen: action.payload,
            };
        case TOGGLE_CUSTOM_MAP:
            return {
                ...state,
                customMapId: action.payload,
            };
        case SET_VIDEO_PLAYING:
            return {
                ...state,
                videoPlayingId: action.payload,
            };
        case UPDATE_URL_PARAM:
            return {
                ...state,
                selectSpot: action.payload.spotId,
                modalVisible: action.payload.modal,
            };
        default:
            return state;
    }
};

export default MapReducers;
