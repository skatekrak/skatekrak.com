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
type Props = {
    url: string;
} & Partial<ReactPlayerProps>;

const VideoPlayer = ({ url, ...props }: Props) => (
    <div className="video-player-container">
        <div className="video-player">
            <ReactPlayer height="100%" width="100%" url={url} {...props} />
        </div>
    </div>
);

/*
 * Export Default
 */
export default VideoPlayer;
