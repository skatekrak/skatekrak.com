import { push, remove } from 'lib/immutable';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from 'wordpress-types';

export type SlicePost = Pick<Post, 'categories' | 'slug' | 'title' | 'featuredImages' | 'id'>;

export type MagState = {
    selectedCategories: string[];
    search: string;
    articles: SlicePost[];
};

export const initialState: MagState = {
    selectedCategories: [],
    search: '',
    articles: [],
};

const magSlice = createSlice({
    name: 'mag',
    initialState,
    reducers: {
        toggleCategory: (state, action: PayloadAction<string>) => {
            const index = state.selectedCategories.indexOf(action.payload);

            return {
                ...state,
                selectedCategories:
                    index === -1
                        ? push(state.selectedCategories, action.payload)
                        : remove(state.selectedCategories, index),
            };
        },
        setMagSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
            return state;
        },
        setArticles: (state, action: PayloadAction<SlicePost[]>) => {
            state.articles = action.payload;
            return state;
        },
        resetCategories: (state) => {
            state.selectedCategories = [];
            return state;
        },
    },
});

export const { toggleCategory, setMagSearch, resetCategories, setArticles } = magSlice.actions;

export default magSlice.reducer;
