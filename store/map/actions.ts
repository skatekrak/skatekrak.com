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
    SELECT_SPOT,
    TOGGLE_SPOT_MODAL,
    TOGGLE_CUSTOM_MAP,
    SET_VIDEO_PLAYING,
    TOGGLE_LEGEND,
    UPDATE_URL_PARAM,
} from './constants';
import type { ViewportProps } from 'react-map-gl';
import { FullSpotTab } from './reducers';

export const selectAllMapFilters = () => action(SELECT_ALL_MAP_FILTERS);
export const unselectAllMapFilters = () => action(UNSELECT_ALL_MAP_FILTERS);
export const toggleMapFilter = (filter: Types | Status) => action(TOGGLE_MAP_FILTER, filter);
export const mapRefreshEnd = () => action(MAP_REFRESH_END);
export const setSpotOverview = (overview?: SpotOverview) => action(SET_SPOT_OVERVIEW, overview);
export const setViewport = (viewport: Partial<ViewportProps>) => action(SET_VIEWPORT, viewport);
export const selectFullSpotTab = (tab?: FullSpotTab) => action(SELECT_FULL_SPOT_TAB, tab);
export const selectSpot = (spotId?: string) => action(SELECT_SPOT, spotId, { pushToUrl: { spot: spotId } });
export const toggleSpotModal = (open = true) =>
    action(TOGGLE_SPOT_MODAL, open, { pushToUrl: { modal: open ? '1' : null } });
export const toggleCustomMap = (customMapId?: string) =>
    action(TOGGLE_CUSTOM_MAP, customMapId, { pushToUrl: { id: customMapId } });
export const toggleLegend = (open: boolean) => action(TOGGLE_LEGEND, open);
export const setVideoPlaying = (id?: string) => action(SET_VIDEO_PLAYING, id);
export const updateUrlParams = ({
    spotId,
    modal,
    customMapId,
}: {
    spotId?: string;
    modal: boolean;
    customMapId?: string;
}) =>
    action(
        UPDATE_URL_PARAM,
        { spotId, modal },
        { pushToUrl: { spot: spotId, modal: modal ? '1' : null, id: customMapId } },
    );
