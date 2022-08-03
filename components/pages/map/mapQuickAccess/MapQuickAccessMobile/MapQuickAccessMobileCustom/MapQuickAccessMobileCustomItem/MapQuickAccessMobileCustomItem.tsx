import React from 'react';
import { useDispatch } from 'react-redux';

import * as S from './MapQuickAccessMobileCustomItem.styled';

import { QuickAccessMap } from '../../../MapQuickAccessDesktop/MapQuickAccessDesktop';
import { updateUrlParams } from 'store/map/slice';
import Typography from 'components/Ui/typography/Typography';

type Props = {
    map: QuickAccessMap;
    closeSheet: () => void;
};

const MapQuickAccessMobileCustomItem: React.FC<Props> = ({ map, closeSheet }) => {
    const dispatch = useDispatch();

    const onClick = (e: React.SyntheticEvent) => {
        e.preventDefault();
        closeSheet();
        // dispatch(toggleSearchResult(false));
        dispatch(
            updateUrlParams({
                spotId: null,
                modal: false,
                customMapId: map.id,
                mediaId: null,
            }),
        );
    };

    return (
        <>
            <S.MapQuickAccessMobileCustomItemContainer href="map" onClick={onClick}>
                <S.MapQuickAccessMobileCustomItemImage
                    src={`/images/map/custom-maps/${map.id}.png`}
                    srcSet={`
                        /images/map/custom-maps/${map.id}.png 1x,
                        /images/map/custom-maps/${map.id}@2x.png 2x,
                        /images/map/custom-maps/${map.id}@3x.png 3x
                    `}
                    alt={`${map.name} map logo`}
                />
                <S.MapQuickAccessMobileCustomItemDesc>
                    <Typography component="condensedHeading6" truncateLines={1}>
                        {map.name}
                    </Typography>
                    <S.MapQuickAccessMobileCustomItemSpots
                        component="body1"
                        truncateLines={1}
                    >{`${map.numberOfSpots} spots`}</S.MapQuickAccessMobileCustomItemSpots>
                </S.MapQuickAccessMobileCustomItemDesc>
            </S.MapQuickAccessMobileCustomItemContainer>
            <S.MapQuickAccessMobileCustomItemDivider />
        </>
    );
};

export default MapQuickAccessMobileCustomItem;
