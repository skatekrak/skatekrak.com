import React, { useState } from 'react';
import { ReactPlayerProps } from 'react-player';

import VideoPlayer from './VideoPlayer';

import { Clip, VideoProvider } from 'lib/carrelageClient';

/*
 * Code
 */
export type VideoPlayerProps = {
    clip: Clip;
    onVideoClick?: () => void;
} & Partial<ReactPlayerProps>;

const VideoPlayerContainer = ({ clip, onVideoClick, ...props }: VideoPlayerProps) => {
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
                <div className="react-player__preview" style={{ backgroundImage: `url(${clip.thumbnailURL})` }}>
                    <div className="react-player__shadow">
                        <div className="react-player__play-icon" />
                    </div>
                </div>
            </button>
        </div>
    ) : (
        <>
            {clip.provider === VideoProvider.YOUTUBE && (
                <VideoPlayer url={clip.videoURL} playing controls pip {...props} />
            )}
            {clip.provider === VideoProvider.VIMEO && (
                <VideoPlayer url={clip.videoURL} playing controls pip {...props} />
            )}
        </>
    );
};

/*
 * Export Default
 */
export default VideoPlayerContainer;
