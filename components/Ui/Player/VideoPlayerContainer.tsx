import React, { useState } from 'react';
import { ReactPlayerProps } from 'react-player';

import VideoPlayer from './VideoPlayer';

import { SourceType } from 'lib/constants';

/*
 * Code
 */
type Props = {
    video: any;
    onVideoClick?: () => void;
} & Partial<ReactPlayerProps>;

const VideoPlayerContainer: React.FC<Props> = ({ video, onVideoClick, ...props }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleVideoClick = () => {
        setIsOpen(true);
        if (onVideoClick) {
            onVideoClick();
        }
    };

    return !isOpen ? (
        <div className="video-player-container">
            <button className="video-player" onClick={handleVideoClick}>
                <div className="react-player__preview" style={{ backgroundImage: `url(${video.thumbnail})` }}>
                    <div className="react-player__shadow">
                        <div className="react-player__play-icon" />
                    </div>
                </div>
            </button>
        </div>
    ) : (
        <>
            {video.source.type === SourceType.YOUTUBE && (
                <VideoPlayer url={`https://www.youtube.com/watch?v=${video.videoId}`} playing controls pip {...props} />
            )}
            {video.source.type === SourceType.VIMEO && (
                <VideoPlayer url={`https://vimeo.com/${video.videoId}`} playing controls pip {...props} />
            )}
        </>
    );
};

/*
 * Export Default
 */
export default VideoPlayerContainer;
