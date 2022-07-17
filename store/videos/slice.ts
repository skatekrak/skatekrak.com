import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { push, remove } from 'lib/immutable';
import { Source } from 'rss-feed';

export type VideosState = {
    selectSources: number[];
    search: string;
};

export const initialState: VideosState = {
    selectSources: [],
    search: '',
};

const videosSlice = createSlice({
    name: 'videos',
    initialState,
    reducers: {
        toggleVideosSource: (state, action: PayloadAction<Source>) => {
            const index = state.selectSources.indexOf(action.payload.id);

            return {
                ...state,
                selectSources:
                    index === -1 ? push(state.selectSources, action.payload.id) : remove(state.selectSources, index),
            };
        },
        selectVideosSources: (state, action: PayloadAction<Source[]>) => {
            return {
                ...state,
                selectSources: action.payload.map((source) => source.id),
            };
        },
        setVideosSearch: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                search: action.payload,
            };
        },
        resetVideos: (state) => {
            return {
                ...state,
                selectSources: [],
            };
        },
    },
});

export const { toggleVideosSource, selectVideosSources, setVideosSearch, resetVideos } = videosSlice.actions;

export default videosSlice.reducer;
