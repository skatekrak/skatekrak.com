import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { toggleLegend } from 'store/map/actions';

const MapSearchResultLoading = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(toggleLegend(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="map-navigation-search-result-loading">
            <span className="skeleton-circle" />
            <div className="skeleton-container-start">
                <span className="skeleton-box" />
                <span className="skeleton-box" />
            </div>
            <div className="skeleton-container-end">
                <span className="skeleton-box" />
                <span className="skeleton-box" />
            </div>
        </div>
    );
};

export default MapSearchResultLoading;
