/*
 * Npm import
 */
import React, { CSSProperties } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';

/*
 * Local import
 */

/*
 * Code
 */

export type VideoPlayerProps = {
    ref: React.LegacyRef<ReactPlayer>;
    videoSize?: {
        width: number;
        height: number;
    };
    style?: CSSProperties;
} & Partial<ReactPlayerProps>;

const VideoPlayer = React.forwardRef<ReactPlayer, VideoPlayerProps>(({ url, videoSize, style, ...props }, ref) => (
    <div
        className="video-player-container"
        style={{ ...(videoSize ? { paddingTop: (videoSize.height / videoSize.width) * 100 + '%' } : {}), ...style }}
    >
        <div className="video-player">
            <ReactPlayer
                playing
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
