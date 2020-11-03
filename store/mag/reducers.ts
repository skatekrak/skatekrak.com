import { ActionType } from 'typesafe-actions';
import { List } from 'immutable';

import { TOGGLE_CATEGORY, SET_MAG_SEARCH, RESET_CATEGORIES } from '../constants';

import * as magActions from './actions';
import { Reducer } from 'redux';

export type MagAction = ActionType<typeof magActions>;

export type MagState = {
    selectedCategories: List<string>;
    search?: string;
};

const initialState: MagState = {
    selectedCategories: List(),
    search: undefined,
};

const MagReducer: Reducer<MagState, MagAction> = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_CATEGORY:
            const index = state.selectedCategories.indexOf(action.payload.id);

            return {
                ...state,
                selectedCategories:
                    index === -1
                        ? state.selectedCategories.push(action.payload.id)
                        : state.selectedCategories.remove(index),
            };
        case SET_MAG_SEARCH:
            return {
                ...state,
                search: action.payload,
            };
        case RESET_CATEGORIES:
            return {
                ...state,
                selectedCategories: List(),
            };
        default:
            return state;
    }
};

export default MagReducer;
