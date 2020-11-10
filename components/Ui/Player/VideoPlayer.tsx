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

const VideoPlayer = React.forwardRef<ReactPlayer, Partial<ReactPlayerProps>>(({ url, ...props }, ref) => (
    <div className="video-player-container">
        <div className="video-player">
            <ReactPlayer
                ref={ref}
                height="100%"
                width="100%"
                url={url}
                config={{ youtube: { playerVars: { disablekb: 0, fs: 1 } } }}
                {...props}
            />
        </div>
    </div>
));

VideoPlayer.displayName = 'VideoPlayer';

/*
 * Export Default
 */
export default VideoPlayer;
