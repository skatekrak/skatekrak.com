import MapMedia from 'components/pages/map/media/MapMedia';
import { KrakLoading } from 'components/Ui/Icons/Spinners';
import React from 'react';
import { Media } from 'shared/feudartifice/types';

import * as S from './MapCustomNavigationMediaFeed.styled';

type Props = {
    medias: Media[];
    isLoading: boolean;
};

const MapCustomNavigationMediaFeed = ({ medias, isLoading }: Props) => {
    return (
        <S.MapCustomNavigationMediaFeedContainer>
            {medias && medias.map((media) => <MapMedia key={media.id} media={media} />)}
            {isLoading && <KrakLoading />}
        </S.MapCustomNavigationMediaFeedContainer>
    );
};

export default MapCustomNavigationMediaFeed;