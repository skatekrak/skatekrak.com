import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Types, Status, SpotOverview } from 'lib/carrelageClient';
import { FilterState } from 'lib/FilterState';
import { ViewState } from 'react-map-gl';

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

export type MapState = {
    types: Record<Types, FilterState>;
    status: Record<Status, FilterState>;
    spotOverview?: SpotOverview;
    viewport: Partial<ViewState & { width: number; height: number }>;
    fullSpotSelectedTab: FullSpotTab;
    selectSpot?: string;
    modalVisible: boolean;
    legendOpen: boolean;
    searchResultOpen: boolean;
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
    searchResultOpen: false,
    customMapId: undefined,
    fullSpotSelectedTab: 'media',
    videoPlayingId: undefined,
};

const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        selectAllMapFilters: (state) => {
            return {
                ...state,
                status: initialState.status,
                types: initialState.types,
            };
        },
        unselectAllMapFilters: (state) => {
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
        },
        toggleMapFilter: (state, action: PayloadAction<Types | Status>) => {
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
        },
        mapRefreshEnd: (state) => {
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
        },
        setSpotOverview: (state, action: PayloadAction<SpotOverview | undefined>) => {
            return {
                ...state,
                spotOverview: action.payload,
            };
        },
        setViewport: (state, action: PayloadAction<Partial<ViewState & { width: number; height: number }>>) => {
            return {
                ...state,
                viewport: {
                    ...state.viewport,
                    ...action.payload,
                },
            };
        },
        selectFullSpotTab: (state, action: PayloadAction<FullSpotTab | undefined>) => {
            return {
                ...state,
                fullSpotSelectedTab: action.payload ?? initialState.fullSpotSelectedTab,
            };
        },
        selectSpot: {
            reducer: (state, action: PayloadAction<string | undefined>) => {
                return {
                    ...state,
                    selectSpot: action.payload,
                };
            },
            prepare: (value?: string) => ({
                payload: value,
                meta: { pushToUrl: { spot: value } },
            }),
        },
        toggleSpotModal: {
            reducer: (state, action: PayloadAction<boolean | undefined>) => {
                const { payload = true } = action;
                return {
                    ...state,
                    modalVisible: payload,
                };
            },
            prepare: (value?: boolean) => ({
                payload: value,
                meta: { pushToUrl: { modal: value ? '1' : null } },
            }),
        },
        toggleCustomMap: {
            reducer: (state, action: PayloadAction<string | undefined>) => {
                return {
                    ...state,
                    customMapId: action.payload,
                };
            },
            prepare: (value?: string) => ({
                payload: value,
                meta: { pushToUrl: { id: value } },
            }),
        },
        toggleLegend: (state, action: PayloadAction<boolean>) => {
            return {
                ...state,
                legendOpen: action.payload,
            };
        },
        setVideoPlaying: (state, action: PayloadAction<string | undefined>) => {
            return {
                ...state,
                videoPlayingId: action.payload,
            };
        },
        toggleSearchResult: (state, action: PayloadAction<boolean>) => {
            return {
                ...state,
                searchResultOpen: action.payload,
            };
        },
        updateUrlParams: {
            reducer: (
                state,
                action: PayloadAction<{ spotId: string | null; modal: boolean; customMapId: string | null }>,
            ) => {
                const spotId = extractData(state.selectSpot, action.payload.spotId);
                const modal = extractData(state.modalVisible, action.payload.modal);
                const customMapId = extractData(state.customMapId, action.payload.customMapId);

                return {
                    ...state,
                    selectSpot: spotId,
                    modalVisible: modal,
                    customMapId: customMapId,
                };
            },
            prepare: ({
                spotId,
                modal,
                customMapId,
            }: {
                spotId: string | null;
                modal: boolean;
                customMapId: string | null;
            }) => ({
                payload: { spotId, modal, customMapId },
                meta: { pushToUrl: { spot: spotId, modal: modal ? '1' : null, id: customMapId } },
            }),
        },
    },
});

const extractData = <T>(defaultValue: T, data?: T | null) => {
    if (data === undefined) {
        return defaultValue;
    } else if (data === null) {
        return undefined;
    }
    return data;
};

export const {
    selectAllMapFilters,
    unselectAllMapFilters,
    toggleMapFilter,
    mapRefreshEnd,
    setSpotOverview,
    setViewport,
    selectFullSpotTab,
    selectSpot,
    toggleSpotModal,
    toggleCustomMap,
    toggleLegend,
    setVideoPlaying,
    toggleSearchResult,
    updateUrlParams,
} = mapSlice.actions;

export default mapSlice.reducer;
