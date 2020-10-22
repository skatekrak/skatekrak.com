import { action } from 'typesafe-actions';

import { Types, Status, SpotOverview } from 'lib/carrelageClient';

import {
    SELECT_ALL_MAP_FILTERS,
    UNSELECT_ALL_MAP_FILTERS,
    TOGGLE_MAP_FILTER,
    MAP_REFRESH_END,
    SET_VIEWPORT,
    SET_SPOT_OVERVIEW,
    SELECT_FULL_SPOT_TAB,
    FLY_TO_CUSTOM_MAP,
    SELECT_SPOT_ID,
} from '../constants';
import { ViewportProps } from 'react-map-gl';
import { FullSpotTab } from './reducers';

export const selectAllMapFilters = () => action(SELECT_ALL_MAP_FILTERS);
export const unselectAllMapFilters = () => action(UNSELECT_ALL_MAP_FILTERS);
export const toggleMapFilter = (filter: Types | Status) => action(TOGGLE_MAP_FILTER, filter);
export const mapRefreshEnd = () => action(MAP_REFRESH_END);
export const setSpotOverview = (overview?: SpotOverview) => action(SET_SPOT_OVERVIEW, overview);
export const setViewport = (viewport: Partial<ViewportProps>) => action(SET_VIEWPORT, viewport);
export const selectFullSpotTab = (tab?: FullSpotTab) => action(SELECT_FULL_SPOT_TAB, tab);
export const flyToCustomMap = (bounds: [[number, number], [number, number]]) => action(FLY_TO_CUSTOM_MAP, bounds);
export const selectSpot = (spotId?: string) => action(SELECT_SPOT_ID, spotId);
