import { ActionType } from 'typesafe-actions';
import { Reducer } from 'redux';

import { push, remove } from 'lib/immutable';

import { TOGGLE_CATEGORY, SET_MAG_SEARCH, RESET_CATEGORIES } from '../constants';
import * as magActions from './actions';

export type MagAction = ActionType<typeof magActions>;

export type MagState = {
    selectedCategories: string[];
    search: string;
};

export const initialState: MagState = {
    selectedCategories: [],
    search: '',
};

const MagReducer: Reducer<MagState, MagAction> = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_CATEGORY:
            const index = state.selectedCategories.indexOf(action.payload.id);

            return {
                ...state,
                selectedCategories:
                    index === -1
                        ? push(state.selectedCategories, action.payload.id)
                        : remove(state.selectedCategories, index),
            };
        case SET_MAG_SEARCH:
            return {
                ...state,
                search: action.payload,
            };
        case RESET_CATEGORIES:
            return {
                ...state,
                selectedCategories: [],
            };
        default:
            return state;
    }
};

export default MagReducer;
