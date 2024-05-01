import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { push, remove } from '@/lib/immutable';
import { Source } from 'rss-feed';

export type VideosState = {
    selectSources: string[];
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
        toggleVideosSource: (state, action: PayloadAction<string>) => {
            const index = state.selectSources.indexOf(action.payload);

            return {
                ...state,
                selectSources:
                    index === -1 ? push(state.selectSources, action.payload) : remove(state.selectSources, index),
            };
        },
        selectVideosSources: (state, action: PayloadAction<Source[]>) => {
            return {
                ...state,
                selectSources: action.payload.map((source) => String(source.id)),
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
