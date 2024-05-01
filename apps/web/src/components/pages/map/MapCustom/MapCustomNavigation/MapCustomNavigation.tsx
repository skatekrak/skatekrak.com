import React, { useMemo } from 'react';

import IconArrow from '@/components/Ui/Icons/Arrow';
import IconArrowHead from '@/components/Ui/Icons/ArrowHead';
import Typography from '@/components/Ui/typography/Typography';
import DividerVertical from '@/components/Ui/dividers/DividerVertical';

import MapCustomNavigationAbout from './MapCustomNavigationAbout';
import MapCustomNavigationSpots from './MapCustomNavigationSpots';
import MapCustomNavigationVideos from './MapCustomNavigationVideos';
import * as S from './MapCustomNavigation.styled';

import { Spot } from '@krak/carrelage-client';
import { updateUrlParams } from '@/store/map/slice';
import MapCustomNavigationExtension from './MapCustomNavigationExtension';
import { useAppDispatch } from '@/store/hook';
import MapCustomNavigationMediaFeed from './MapCustomNavigationMediaFeed';
import { useMedias } from '@/shared/feudartifice/hooks/media';

type MapCustomNavigationProps = {
    id: string;
    title: string;
    about: string;
    subtitle: string;
    spots: Spot[];
    videos: string[];
};

const MapCustomNavigation = ({ id, title, about, subtitle, spots, videos }: MapCustomNavigationProps) => {
    const dispatch = useAppDispatch();

    const today = useMemo(() => {
        return new Date();
    }, []);

    const { data: medias } = useMedias({
        older: today,
        limit: 1,
        hashtag: id,
    });

    const goBack = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        dispatch(
            updateUrlParams({
                customMapId: null,
                modal: false,
                spotId: null,
                mediaId: null,
            }),
        );
    };

    return (
        <S.MapCustomNavigation>
            <S.MapCustomNavigationMainContainer>
                <S.MapCustomNavigationClose href="map" onClick={goBack} id="custom-map-navigation-close">
                    <IconArrow />
                    <Typography component="subtitle1">Back</Typography>
                </S.MapCustomNavigationClose>
                <DividerVertical />
                <S.MapCustomNavigationMain>
                    <S.MapCustomNavigationMainLogoContainer>
                        <S.MapCustomNavigationMainLogo
                            src={`/images/map/custom-maps/${id}.png`}
                            id="custom-map-navigation-main-logo"
                            alt={`${title} logo`}
                            fill
                        />
                    </S.MapCustomNavigationMainLogoContainer>
                    <S.MapCustomNavigationMainName component="condensedHeading6" truncateLines={1}>
                        {title}
                    </S.MapCustomNavigationMainName>
                </S.MapCustomNavigationMain>
            </S.MapCustomNavigationMainContainer>
            <S.MapCustomNavigationLinksContainer>
                {about !== '' && (
                    <MapCustomNavigationExtension
                        render={() => <MapCustomNavigationAbout subtitle={subtitle} about={about} />}
                    >
                        <S.MapCustomNavigationLink>
                            <Typography component="body1">about</Typography>
                            <IconArrowHead />
                        </S.MapCustomNavigationLink>
                    </MapCustomNavigationExtension>
                )}
                {spots.length > 0 && (
                    <MapCustomNavigationExtension
                        render={({ close }) => <MapCustomNavigationSpots mapSpots={spots} closeExtension={close} />}
                    >
                        <S.MapCustomNavigationLink>
                            <Typography component="body1">{spots.length} spots</Typography>
                            <IconArrowHead />
                        </S.MapCustomNavigationLink>
                    </MapCustomNavigationExtension>
                )}
                {videos?.length > 0 && (
                    <MapCustomNavigationExtension render={() => <MapCustomNavigationVideos videos={videos} />}>
                        <S.MapCustomNavigationLink>
                            <Typography component="body1">video</Typography>
                            <IconArrowHead />
                        </S.MapCustomNavigationLink>
                    </MapCustomNavigationExtension>
                )}
                {medias != null && medias.length > 0 && (
                    <MapCustomNavigationExtension
                        id="feed-container"
                        render={() => <MapCustomNavigationMediaFeed mapId={id} />}
                    >
                        <S.MapCustomNavigationLink>
                            <Typography component="body1">media</Typography>
                            <IconArrowHead />
                        </S.MapCustomNavigationLink>
                    </MapCustomNavigationExtension>
                )}
            </S.MapCustomNavigationLinksContainer>
        </S.MapCustomNavigation>
    );
};

export default React.memo(MapCustomNavigation);
