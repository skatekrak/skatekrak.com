import { ActionType } from 'typesafe-actions';

import { RESET_FORM, UPDATE_FORM_STATE } from '../constants';

import * as form from './actions';

export type FormAction = ActionType<typeof form>;

export type State = {
    [key: string]: any;
};

export default (state: State = {}, action: FormAction): State => {
    switch (action.type) {
        case UPDATE_FORM_STATE: {
            return {
                ...state,
                [action.payload.form]: action.payload.state,
            };
        }
        case RESET_FORM: {
            return {};
        }
        default:
            return state;
    }
};
