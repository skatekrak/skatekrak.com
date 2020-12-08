import { FlyToInterpolator, WebMercatorViewport } from 'react-map-gl';
import { ThunkAction } from 'redux-thunk';

import { RootState } from 'store/reducers';
import { setViewport } from './actions';
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

export { flyTo };
