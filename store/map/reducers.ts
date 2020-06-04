import { ActionType } from 'typesafe-actions';

import { Types, Status } from 'lib/carrelageClient';
import { SET_MAP_SPOTS_STATUS, SET_MAP_SPOTS_TYPE } from '../constants';
import * as mapActions from './actions';

export type MapAction = ActionType<typeof mapActions>;

export type MapState = {
    types: Types[];
    status: Status[];
};

const initialState: MapState = {
    types: [Types.Diy, Types.Park, Types.Private, Types.Shop, Types.Street],
    status: [Status.Active, Status.Rip, Status.Wip],
};

export default (state: MapState = initialState, action: MapAction): MapState => {
    switch (action.type) {
        case SET_MAP_SPOTS_STATUS:
            return {
                ...state,
                status: action.payload,
            };
        case SET_MAP_SPOTS_TYPE:
            return {
                ...state,
                types: action.payload,
            };
        default:
            return state;
    }
};
