import { action } from 'typesafe-actions';

import { SET_DEVICE_SIZE } from '../constants';

export const setDeviceSize = (width: number) => action(SET_DEVICE_SIZE, width);
