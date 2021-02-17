import { ActionType } from 'typesafe-actions';

import { SET_DEVICE_SIZE } from '../constants';

import * as settings from './actions';

export type SettingsAction = ActionType<typeof settings>;

export enum FeedLayout {
    OneColumn = 768,
    TwoColumns = 1440,
    FourColumns = 1000000,
}

export type State = {
    isMobile: boolean | null;
    feedLayout: FeedLayout | null;
};

const initialState: State = {
    isMobile: null,
    feedLayout: null,
};

const SettingsReducer = (state: State = initialState, action: SettingsAction): State => {
    switch (action.type) {
        case SET_DEVICE_SIZE:
            const res = { ...state, isMobile: action.payload < 1024 };
            if (action.payload < FeedLayout.OneColumn) {
                res.feedLayout = FeedLayout.OneColumn;
            } else if (action.payload < FeedLayout.TwoColumns) {
                res.feedLayout = FeedLayout.TwoColumns;
            } else {
                res.feedLayout = FeedLayout.FourColumns;
            }
            return res;
        default:
            return state;
    }
};

export default SettingsReducer;
