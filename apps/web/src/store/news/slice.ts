import { Source } from 'rss-feed';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { push, remove } from '@/lib/immutable';

export type NewsState = {
    selectSources: string[];
    search: string;
};

export const initialState: NewsState = {
    selectSources: [],
    search: '',
};

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        selectNewsSources: (state, action: PayloadAction<Source[]>) => {
            return {
                ...state,
                selectSources: action.payload.map((source) => `${source.id}`),
            };
        },
        toggleNewsSource: (state, action: PayloadAction<string>) => {
            const index = state.selectSources.indexOf(action.payload);

            return {
                ...state,
                selectSources:
                    index === -1 ? push(state.selectSources, action.payload) : remove(state.selectSources, index),
            };
        },
        setNewsSearch: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                search: action.payload,
            };
        },
        resetNews: (state) => {
            return {
                ...state,
                selectSources: [],
            };
        },
    },
});

export const { selectNewsSources, toggleNewsSource, setNewsSearch, resetNews } = newsSlice.actions;

export default newsSlice.reducer;
