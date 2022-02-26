import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import * as S from './MapSearchResults.styled';

import { toggleLegend } from 'store/map/actions';

const MapSearchResultLoading = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(toggleLegend(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <S.MapSearchResultsLoading>
            <span className="skeleton-circle" />
            <div className="skeleton-container-start">
                <span className="skeleton-box" />
                <span className="skeleton-box" />
            </div>
            <div className="skeleton-container-end">
                <span className="skeleton-box" />
                <span className="skeleton-box" />
            </div>
        </S.MapSearchResultsLoading>
    );
};

export default MapSearchResultLoading;
