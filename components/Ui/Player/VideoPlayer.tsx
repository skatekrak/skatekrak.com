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
type Props = {} & Partial<ReactPlayerProps>;

const VideoPlayer = ({ url, ...props }: Props) => (
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
