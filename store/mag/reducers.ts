import { ActionType } from 'typesafe-actions';

import { FilterState, FilterStateUtil } from 'lib/FilterState';
import LocalStorage from 'lib/LocalStorage';

import { TOGGLE_CATEGORY, SET_MAG_SEARCH, RESET_CATEGORIES } from '../constants';

import * as magActions from './actions';
import { Reducer } from 'redux';

export type MagAction = ActionType<typeof magActions>;

export type MagState = {
    categories: Record<string, FilterState>;
    search?: string;
};

const initialState: MagState = {
    categories: {},
    search: undefined,
};

const MagReducer: Reducer<MagState, MagAction> = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_CATEGORY:
            const categories = Object.assign({}, state.categories);

            if (categories[action.payload.id] != null) {
                delete categories[action.payload.id];
            } else {
                categories[action.payload.id] = FilterState.SELECTED;
            }

            return {
                ...state,
                categories,
            };
        case SET_MAG_SEARCH:
            return {
                ...state,
                search: action.payload,
            };
        case RESET_CATEGORIES:
            return {
                ...state,
                categories: {},
            };
        default:
            return state;
    }
};

export default MagReducer;
