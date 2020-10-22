/*
 * Npm import
 */
import React from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';

/*
 * Local import
 */

/*
 * Code
 */

const VideoPlayer = ({ url, ...props }: Partial<ReactPlayerProps>) => (
    <div className="video-player-container">
        <div className="video-player">
            <ReactPlayer
                height="100%"
                width="100%"
                url={url}
                config={{ youtube: { playerVars: { disablekb: 0, fs: 1 } } }}
                {...props}
            />
        </div>
    </div>
);

/*
 * Export Default
 */
export default VideoPlayer;
