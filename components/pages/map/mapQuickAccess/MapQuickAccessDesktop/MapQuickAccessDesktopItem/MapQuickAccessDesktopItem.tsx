import React, { useCallback } from 'react';

import IconArrowHead from 'components/Ui/Icons/ArrowHead';
import type {
    QuickAccess,
    QuickAccessMap,
} from 'components/pages/map/mapQuickAccess/MapQuickAccessDesktop/MapQuickAccessDesktop';
import * as S from './MapQuickAccessDesktopItem.styled';
import Typography from 'components/Ui/typography/Typography';
import MapQuickAccessDesktopItemDescriptionTooltip from './MapQuickAccessDesktopItemDescriptionTooltip';

type Props = {
    data: QuickAccessMap | QuickAccess;
    selected?: boolean;
    noMapSelected: boolean;
    onClick: (e: React.SyntheticEvent) => void;
};

const MapQuickAccessDesktopItem = ({ data, selected, noMapSelected, onClick }: Props) => {
    const isQuickAccessMap = (data: unknown): data is QuickAccessMap => {
        return data != null && (data as QuickAccessMap).numberOfSpots != null;
    };

    const renderTooltip = useCallback(
        (props) => {
            return (
                <S.MapQuickAccessDesktopItemDescription {...props} onClick={onClick}>
                    <S.MapQuickAccessDesktopItemHeader>
                        <Typography as="h4" component="condensedHeading6">
                            {data.name}
                        </Typography>
                        <IconArrowHead />
                    </S.MapQuickAccessDesktopItemHeader>
                    <S.MapQuickAccessDesktopItemBody component="body2">{data.edito}</S.MapQuickAccessDesktopItemBody>
                    {isQuickAccessMap(data) && <Typography component="body2">{data.numberOfSpots} spots</Typography>}
                </S.MapQuickAccessDesktopItemDescription>
            );
        },
        [data, onClick],
    );

    return (
        <MapQuickAccessDesktopItemDescriptionTooltip render={renderTooltip}>
            <S.MapQuickAccessDesktopItem onClick={onClick}>
                <S.MapQuickAccessDesktopItemImageContainer isSelected={selected}>
                    <S.MapQuickAccessDesktopItemImage
                        noMapSelected={noMapSelected}
                        src={`/images/map/custom-maps/${data.id}.png`}
                        srcSet={getSrcSet(data.id, isQuickAccessMap(data))}
                        alt={`${data.name} map logo`}
                    />
                </S.MapQuickAccessDesktopItemImageContainer>
            </S.MapQuickAccessDesktopItem>
        </MapQuickAccessDesktopItemDescriptionTooltip>
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

export default React.memo(MapQuickAccessDesktopItem);
