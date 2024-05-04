import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { Types, Status, SpotOverview } from '@krak/carrelage-client';
import { FilterState } from '@/lib/FilterState';
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
    legendOpen: boolean;
    searchResultOpen: boolean;
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
    legendOpen: false,
    searchResultOpen: false,
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
        setSpotOverview: (state, action: PayloadAction<SpotOverview | undefined>) => {
            return {
                ...state,
                spotOverview: action.payload,
            };
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
        toggleCreateSpot: (state) => {
            state.isCreateSpotOpen = !state.isCreateSpotOpen;
            return state;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(HYDRATE, (state, action: AnyAction) => {
            const nextState = merge(state, action.payload.map);
            return nextState;
        });
    },
});

export function getSelectedFilterState<T extends string>(filterState: Record<T, FilterState>): T[] {
    const keys = Object.keys(filterState) as T[];
    return keys.filter((key) => filterState[key] === FilterState.SELECTED);
}

export const {
    selectAllMapFilters,
    unselectAllMapFilters,
    toggleMapFilter,
    setSpotOverview,
    toggleLegend,
    setVideoPlaying,
    toggleSearchResult,
    toggleCreateSpot,
} = mapSlice.actions;

export default mapSlice.reducer;
