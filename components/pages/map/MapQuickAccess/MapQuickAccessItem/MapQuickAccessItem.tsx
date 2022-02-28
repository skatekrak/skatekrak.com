import React from 'react';

import IconArrowHead from 'components/Ui/Icons/ArrowHead';
import type { QuickAccess, QuickAccessMap } from 'components/pages/map/MapQuickAccess/MapQuickAccess';
import * as S from './MapQuickAccessItem.styled';
import Typography from 'components/Ui/typography/Typography';

type Props = {
    data: QuickAccessMap | QuickAccess;
    selected?: boolean;
    noMapSelected: boolean;
    onClick: (e: React.SyntheticEvent) => void;
};

const MapQuickAccessItem = ({ data, selected, noMapSelected, onClick }: Props) => {
    const isQuickAccessMap = (data: unknown): data is QuickAccessMap => {
        return data != null && (data as QuickAccessMap).numberOfSpots != null;
    };

    return (
        <S.MapQuickAccessItem href="map" onClick={onClick}>
            <S.MapQuickAccessItemImageContainer isSelected={selected}>
                <S.MapQuickAccessItemImage
                    noMapSelected={noMapSelected}
                    src={`/images/map/custom-maps/${data.id}.png`}
                    srcSet={getSrcSet(data.id, isQuickAccessMap(data))}
                    alt={`${data.name} map logo`}
                />
            </S.MapQuickAccessItemImageContainer>
            <S.MapQuickAccessItemDescription>
                <S.MapQuickAccessItemHeader>
                    <Typography as="h4" component="condensedHeading6">
                        {data.name}
                    </Typography>
                    <IconArrowHead />
                </S.MapQuickAccessItemHeader>
                <S.MapQuickAccessItemBody component="body2">{data.edito}</S.MapQuickAccessItemBody>
                {isQuickAccessMap(data) && <Typography component="body2">{data.numberOfSpots} spots</Typography>}
            </S.MapQuickAccessItemDescription>
        </S.MapQuickAccessItem>
    );
};

function getSrcSet(id: string, isQuickAccessMap: boolean): string {
    if (isQuickAccessMap) {
        return `/images/map/custom-maps/${id}.png 1x,
        /images/map/custom-maps/${id}@2x.png 2x,
        /images/map/custom-maps/${id}@3x.png 3x`;
    }

    return `
        /images/map/cities/${id}.jpg 1x,
        /images/map/cities/${id}@2x.jpg 2x,
        /images/map/cities/${id}@3x.jpg 3x
    `;
}

export default React.memo(MapQuickAccessItem);
