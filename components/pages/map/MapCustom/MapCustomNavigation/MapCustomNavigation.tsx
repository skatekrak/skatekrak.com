import React, { useMemo } from 'react';

import IconArrow from 'components/Ui/Icons/Arrow';
import IconArrowHead from 'components/Ui/Icons/ArrowHead';
import Typography from 'components/Ui/typography/Typography';
import DividerVertical from 'components/Ui/dividers/DividerVertical';

import MapCustomNavigationAbout from './MapCustomNavigationAbout';
import MapCustomNavigationSpots from './MapCustomNavigationSpots';
import MapCustomNavigationVideos from './MapCustomNavigationVideos';
import * as S from './MapCustomNavigation.styled';

import { Spot } from 'lib/carrelageClient';
import { updateUrlParams } from 'store/map/slice';
import MapCustomNavigationExtension from './MapCustomNavigationExtension';
import { useAppDispatch } from 'store/hook';
import MapCustomNavigationMediaFeed from './MapCustomNavigationMediaFeed';
import { useMedias } from 'shared/feudartifice/hooks/media';

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

    const { isLoading, data: medias } = useMedias({
        older: today,
        limit: 10,
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
                            srcSet={`
                                /images/map/custom-maps/${id}.png 1x,
                                /images/map/custom-maps/${id}@2x.png 2x,
                                /images/map/custom-maps/${id}@3x.png 3x
                            `}
                            id="custom-map-navigation-main-logo"
                        />
                    </S.MapCustomNavigationMainLogoContainer>
                    <S.MapCustomNavigationMainName component="condensedHeading6" truncateLines={1}>
                        {title}
                    </S.MapCustomNavigationMainName>
                </S.MapCustomNavigationMain>
            </S.MapCustomNavigationMainContainer>
            <S.MapCustomNavigationLinksContainer>
                <MapCustomNavigationExtension
                    render={() => <MapCustomNavigationAbout subtitle={subtitle} about={about} />}
                >
                    <S.MapCustomNavigationLink>
                        <Typography component="body1">about</Typography>
                        <IconArrowHead />
                    </S.MapCustomNavigationLink>
                </MapCustomNavigationExtension>
                <MapCustomNavigationExtension
                    render={({ close }) => <MapCustomNavigationSpots mapSpots={spots} closeExtension={close} />}
                >
                    <S.MapCustomNavigationLink>
                        <Typography component="body1">{spots.length} spots</Typography>
                        <IconArrowHead />
                    </S.MapCustomNavigationLink>
                </MapCustomNavigationExtension>
                {videos?.length > 0 && (
                    <MapCustomNavigationExtension render={() => <MapCustomNavigationVideos videos={videos} />}>
                        <S.MapCustomNavigationLink>
                            <Typography component="body1">video</Typography>
                            <IconArrowHead />
                        </S.MapCustomNavigationLink>
                    </MapCustomNavigationExtension>
                )}
                {medias?.length > 0 && (
                    <MapCustomNavigationExtension
                        render={() => <MapCustomNavigationMediaFeed medias={medias} isLoading={isLoading} />}
                    >
                        <S.MapCustomNavigationLink>
                            <Typography component="body1">{medias.length} media</Typography>
                            <IconArrowHead />
                        </S.MapCustomNavigationLink>
                    </MapCustomNavigationExtension>
                )}
            </S.MapCustomNavigationLinksContainer>
        </S.MapCustomNavigation>
    );
};

export default React.memo(MapCustomNavigation);
