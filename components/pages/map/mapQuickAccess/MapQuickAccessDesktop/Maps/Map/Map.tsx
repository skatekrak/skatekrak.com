import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import * as S from './Map.styled';

import { toggleLegend, toggleSearchResult } from 'store/map/slice';
import { updateUrlParams } from 'store/map/slice';
import { QuickAccessMap } from '../../../types';
import { useRouter } from 'next/router';
import RoundedImage from '../../components/RoundedImage';

type MapProps = {
    map: QuickAccessMap;
    onClick: () => void;
};

const Map: React.FC<MapProps> = ({ map, onClick }) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const isMapSelected = useMemo(() => {
        return router.query.id === map.id;
    }, [router.query.id, map.id]);

    const handleClick = (e: React.SyntheticEvent) => {
        e.preventDefault();
        dispatch(toggleLegend(false));
        dispatch(toggleSearchResult(false));
        dispatch(
            updateUrlParams({
                spotId: null,
                modal: false,
                customMapId: map.id,
                mediaId: null,
            }),
        );
        onClick();
    };

    return (
        <S.MapCard onClick={handleClick}>
            <S.MapButton>
                <RoundedImage
                    selected={isMapSelected}
                    faded={false}
                    size="3rem"
                    src={`/images/map/custom-maps/${map.id}.png`}
                    alt={map.name}
                />
                <S.MapName component="condensedSubtitle1" truncateLines={1}>
                    {map.name}
                </S.MapName>
                <S.MapSpots component="caption" truncateLines={1}>
                    {map.numberOfSpots} spot{map.numberOfSpots > 1 && 's'}
                </S.MapSpots>
            </S.MapButton>
        </S.MapCard>
    );
};

export default React.memo(Map);
