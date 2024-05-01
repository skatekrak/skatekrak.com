import React from 'react';

import * as S from './MapCustomNavigationAbout.styled';

type Props = {
    subtitle: string;
    about: string;
};

const MapCustomNavigationAbout = ({ subtitle, about }: Props) => {
    return (
        <S.MapCustomNavigationAboutContainer>
            <S.MapCustomNavigationAboutTitle component="condensedHeading6">{subtitle}</S.MapCustomNavigationAboutTitle>
            <S.MapCustomNavigationAboutDesc>{about}</S.MapCustomNavigationAboutDesc>
        </S.MapCustomNavigationAboutContainer>
    );
};

export default MapCustomNavigationAbout;
