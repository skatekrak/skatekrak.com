import { action } from 'typesafe-actions';

import { Types, Status, Spot } from 'lib/carrelageClient';

import {
    SELECT_ALL_MAP_FILTERS,
    UNSELECT_ALL_MAP_FILTERS,
    TOGGLE_MAP_FILTER,
    MAP_REFRESH_END,
    SELECT_SPOT,
    SET_VIEWPORT,
} from '../constants';
import { ViewportProps } from 'react-map-gl';

export const selectAllMapFilters = () => action(SELECT_ALL_MAP_FILTERS);
export const unselectAllMapFilters = () => action(UNSELECT_ALL_MAP_FILTERS);
export const toggleMapFilter = (filter: Types | Status) => action(TOGGLE_MAP_FILTER, filter);
export const mapRefreshEnd = () => action(MAP_REFRESH_END);
export const selectSpot = (spot?: Spot) => action(SELECT_SPOT, spot);
export const setViewport = (viewport: Partial<ViewportProps>) => action(SET_VIEWPORT, viewport);
