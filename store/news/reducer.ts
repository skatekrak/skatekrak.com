import { ActionType, Reducer } from 'typesafe-actions';

import { push, remove } from 'lib/immutable';

import { SELECT_NEWS_SOURCES, TOGGLE_NEWS_SOURCE, SET_NEWS_SEARCH, RESET_NEWS } from '../constants';

import * as news from './actions';
export type NewsAction = ActionType<typeof news>;

export type NewsState = {
    selectSources: string[];
    search: string;
};

const initialState: NewsState = {
    selectSources: [],
    search: '',
};

const NewsReducer: Reducer<NewsState, NewsAction> = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_NEWS_SOURCE: {
            const index = state.selectSources.indexOf(action.payload.id);

            return {
                ...state,
                selectSources:
                    index !== -1 ? push(state.selectSources, action.payload.id) : remove(state.selectSources, index),
            };
        }
        case SELECT_NEWS_SOURCES: {
            return {
                ...state,
                selectSources: action.payload.map((source) => source.id),
            };
        }
        case SET_NEWS_SEARCH:
            return {
                ...state,
                search: action.payload,
            };
        case RESET_NEWS:
            return {
                ...state,
                selectLanguages: [],
                selectSources: [],
            };
        default:
            return state;
    }
};

export default NewsReducer;
