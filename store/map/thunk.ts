import { FlyToInterpolator, WebMercatorViewport } from 'react-map-gl';
import { ThunkAction } from 'redux-thunk';

import { RootState } from 'store/reducers';
import { setViewport, _updateUrlParams } from './actions';
import { MapAction } from './reducers';

const flyTo = (bounds: [[number, number], [number, number]]): ThunkAction<void, RootState, undefined, MapAction> => {
    return (dispatch, getState) => {
        const { viewport } = getState().map;

        const { longitude, latitude, zoom } = new WebMercatorViewport(viewport).fitBounds(bounds, {
            padding: viewport.width * 0.15, // padding of 15%
        });

        return dispatch(
            setViewport({
                latitude,
                longitude,
                zoom,
                transitionDuration: 1500,
                transitionInterpolator: new FlyToInterpolator(),
            }),
        );
    };
};

const extractData = <T>(defaultValue: T, data?: T | null) => {
    if (data === undefined) {
        return defaultValue;
    } else if (data === null) {
        return undefined;
    }
    return data;
};

const updateUrlParams = ({
    spotId,
    modal,
    customMapId,
}: {
    spotId?: string | null;
    modal: boolean;
    customMapId?: string | null;
}): ThunkAction<void, RootState, undefined, MapAction> => {
    return (dispatch, getState) => {
        const { map } = getState();

        const _spotId = extractData(map.selectSpot, spotId);
        const _modal = extractData(map.modalVisible, modal);
        const _customMapId = extractData(map.customMapId, customMapId);

        return dispatch(
            _updateUrlParams({
                spotId: _spotId,
                customMapId: _customMapId,
                modal: _modal,
            }),
        );
    };
};

export { flyTo, updateUrlParams };
