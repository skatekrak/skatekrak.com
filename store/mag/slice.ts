import { Source } from 'rss-feed';

import { push, remove } from 'lib/immutable';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MagState = {
    selectedCategories: string[];
    search: string;
};

export const initialState: MagState = {
    selectedCategories: [],
    search: '',
};

const magSlice = createSlice({
    name: 'mag',
    initialState,
    reducers: {
        toggleCategory: (state, action: PayloadAction<Source>) => {
            const index = state.selectedCategories.indexOf(action.payload.id);

            return {
                ...state,
                selectedCategories:
                    index === -1
                        ? push(state.selectedCategories, action.payload.id)
                        : remove(state.selectedCategories, index),
            };
        },
        setMagSearch: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                search: action.payload,
            };
        },
        resetCategories: (state) => {
            return {
                ...state,
                selectedCategories: [],
            };
        },
    },
});

export const { toggleCategory, setMagSearch, resetCategories } = magSlice.actions;

export default magSlice.reducer;
