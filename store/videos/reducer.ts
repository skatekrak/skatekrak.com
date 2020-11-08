import { ActionType, Reducer } from 'typesafe-actions';

import { push, remove } from 'lib/immutable';

import { TOGGLE_VIDEOS_SOURCE, SELECT_VIDEOS_SOURCES, SET_VIDEOS_SEARCH, RESET_VIDEOS } from '../constants';
import * as videos from './action';
export type VideosAction = ActionType<typeof videos>;

export type VideosState = {
    selectSources: string[];
    search: string;
};

export const initialState: VideosState = {
    selectSources: [],
    search: '',
};

const VideosReducer: Reducer<VideosState, VideosAction> = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_VIDEOS_SOURCE: {
            const index = state.selectSources.indexOf(action.payload.id);

            return {
                ...state,
                selectSources:
                    index === -1 ? push(state.selectSources, action.payload.id) : remove(state.selectSources, index),
            };
        }
        case SELECT_VIDEOS_SOURCES: {
            return {
                ...state,
                selectSources: action.payload.map((source) => source.id),
            };
        }
        case SET_VIDEOS_SEARCH:
            return {
                ...state,
                search: action.payload,
            };
        case RESET_VIDEOS:
            return {
                ...state,
                selectSources: [],
            };
        default:
            return state;
    }
};

export default VideosReducer;
