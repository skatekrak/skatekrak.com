import { action } from 'typesafe-actions';

import { Types, Status } from 'lib/carrelageClient';

import { SET_MAP_SPOTS_STATUS, SET_MAP_SPOTS_TYPE } from '../constants';

export const setMapSpotsType = (types: Types[]) => action(SET_MAP_SPOTS_TYPE, types);
export const setMapSpotsStatus = (status: Status[]) => action(SET_MAP_SPOTS_STATUS, status);
