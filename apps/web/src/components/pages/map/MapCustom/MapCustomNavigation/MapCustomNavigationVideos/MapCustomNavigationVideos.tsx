import VideoPlayer from '@/components/Ui/Player/VideoPlayer';
import React from 'react';

import * as S from './MapCustomNavigationVideos.styled';

type Props = {
    videos: string[];
};

const MapCustomNavigationVideos = ({ videos }: Props) => {
    return (
        <S.MapCustomNavigationVideosContainer>
            {videos.map((video) => (
                <S.MapCustomNavigationVideo key={video}>
                    <VideoPlayer url={video} controls />
                </S.MapCustomNavigationVideo>
            ))}
        </S.MapCustomNavigationVideosContainer>
    );
};

export default MapCustomNavigationVideos;
