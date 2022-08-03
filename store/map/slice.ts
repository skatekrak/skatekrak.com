import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Types, Status, SpotOverview } from 'lib/carrelageClient';
import { FilterState } from 'lib/FilterState';
import { ViewState } from 'react-map-gl';
import merge from 'deepmerge';
import { HYDRATE } from 'next-redux-wrapper';

export type FullSpotTab =
    | 'info'
    | 'clips'
    | 'addClip'
    | 'tips'
    | 'edito'
    | 'media'
    | 'addMedia'
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
    /// ID of the media in full in spot modal
    media?: string;
    modalVisible: boolean;
    legendOpen: boolean;
    searchResultOpen: boolean;
    customMapId?: string;
    videoPlayingId?: string;
    isCreateSpotOpen: boolean;
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
        zoom: 12.6,
    },
    modalVisible: false,
    legendOpen: false,
    searchResultOpen: false,
    fullSpotSelectedTab: 'media',
    isCreateSpotOpen: false,
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

                state.types = map;
            } else if (Object.values(Status).includes(filter as any)) {
                const map = Object.assign({}, state.status);
                const filterState = state.status[filter as Status];

                if (filterState === FilterState.SELECTED) {
                    map[filter as Status] = FilterState.LOADING_TO_UNSELECTED;
                } else if (filterState === FilterState.UNSELECTED) {
                    map[filter as Status] = FilterState.LOADING_TO_SELECTED;
                }

                state.status = map;
            }
        },
        mapRefreshEnd: (state) => {
            for (const key in state.status) {
                if (state.status[key] === FilterState.LOADING_TO_SELECTED) {
                    state.status[key] = FilterState.SELECTED;
                } else if (state.status[key] === FilterState.LOADING_TO_UNSELECTED) {
                    state.status[key] = FilterState.UNSELECTED;
                }
            }

            for (const key in state.types) {
                if (state.types[key] === FilterState.LOADING_TO_SELECTED) {
                    state.types[key] = FilterState.SELECTED;
                } else if (state.types[key] === FilterState.LOADING_TO_UNSELECTED) {
                    state.types[key] = FilterState.UNSELECTED;
                }
            }
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
                meta: { pushToUrl: { spot: value ?? null } },
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
                    customMapId: action.payload ?? null,
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
                action: PayloadAction<{
                    spotId?: string | null;
                    modal?: boolean;
                    customMapId?: string | null;
                    mediaId?: string | null;
                }>,
            ) => {
                console.log('payload', action.payload);
                const spotId = extractData(state.selectSpot, action.payload.spotId);
                const modal = extractData(state.modalVisible, action.payload.modal);
                const customMapId = extractData(state.customMapId, action.payload.customMapId);
                const mediaId = extractData(state.media, action.payload.mediaId);

                console.log('new payload', { spotId, modal, customMapId, mediaId });

                return {
                    ...state,
                    selectSpot: spotId,
                    modalVisible: modal,
                    customMapId: customMapId,
                    media: mediaId,
                };
            },
            prepare: ({
                spotId,
                modal,
                customMapId,
                mediaId,
            }: {
                spotId?: string | null;
                modal?: boolean;
                customMapId?: string | null;
                mediaId?: string | null;
            }) => {
                let newModalUrl = undefined;
                if (newModalUrl === null || newModalUrl === false) {
                    newModalUrl = null;
                } else if (newModalUrl === true) {
                    newModalUrl = '1';
                }

                return {
                    payload: { spotId, modal, customMapId, mediaId },
                    meta: {
                        pushToUrl: {
                            spot: spotId,
                            modal: newModalUrl,
                            id: customMapId,
                            media: mediaId,
                        },
                    },
                };
            },
        },
        toggleCreateSpot: (state) => {
            state.isCreateSpotOpen = !state.isCreateSpotOpen;
            return state;
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            const nextState: any = merge(state, action.payload.map);

            return nextState;
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

export function getSelectedFilterState<T extends string>(filterState: Record<T, FilterState>): T[] {
    const keys = Object.keys(filterState) as T[];
    return keys.filter((key) => filterState[key] === FilterState.SELECTED);
}

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
    toggleCreateSpot,
} = mapSlice.actions;

export default mapSlice.reducer;
