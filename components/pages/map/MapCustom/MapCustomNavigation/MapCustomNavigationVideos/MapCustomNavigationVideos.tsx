import VideoPlayer from 'components/Ui/Player/VideoPlayer';
import React from 'react';

import * as S from './MapCustomNavigationVideos.styled';

type Props = {
    videos: any[];
};

const MapCustomNavigationVideos = ({ videos }: Props) => {
    return (
        <S.MapCustomNavigationVideosContainer>
            {videos.map((video) => (
                <S.MapCustomNavigationVideo key={video.name}>
                    <S.MapCustomNavigationVideoTitle component="heading6">{video.name}</S.MapCustomNavigationVideoTitle>
                    <VideoPlayer url={video.url} controls />
                </S.MapCustomNavigationVideo>
            ))}
        </S.MapCustomNavigationVideosContainer>
    );
};

export default MapCustomNavigationVideos;
