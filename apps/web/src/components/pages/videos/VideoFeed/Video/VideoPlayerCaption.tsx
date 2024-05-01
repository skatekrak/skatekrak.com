/*
 * Npm import
 */
import { useRouter } from 'next/router';
import React from 'react';
import { IContent } from 'rss-feed';

/*
 * Code
 */
type Props = {
    video: IContent;
};

const VideoPlayerCaption = ({ video }: Props) => {
    const router = useRouter();

    const onVideoClick = () => {
        router.replace('/video?id=' + video.id);
    };

    return (
        <div className="video-player-container">
            <button className="video-player" onClick={onVideoClick}>
                <div className="react-player__preview" style={{ backgroundImage: `url(${video.thumbnailUrl})` }}>
                    <div className="react-player__shadow">
                        <div className="react-player__play-icon" />
                    </div>
                </div>
            </button>
        </div>
    );
};

/*
 * Export Default
 */
export default VideoPlayerCaption;
