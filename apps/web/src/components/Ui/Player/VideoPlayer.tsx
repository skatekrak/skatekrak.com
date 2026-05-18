/*
 * Npm import
 */
import React, { type CSSProperties, type ComponentProps } from 'react';
import ReactPlayer from 'react-player';

/*
 * Local import
 */

/*
 * Code
 */

export type VideoPlayerProps = {
    url?: ComponentProps<typeof ReactPlayer>['src'];
    videoSize?: {
        width: number;
        height: number;
    };
    style?: CSSProperties;
} & Omit<Partial<ComponentProps<typeof ReactPlayer>>, 'src'>;

const VideoPlayer = React.forwardRef<HTMLVideoElement, VideoPlayerProps>(({ url, videoSize, style, ...props }, ref) => (
    <div
        className="video-player-container"
        style={{ ...(videoSize ? { paddingTop: (videoSize.height / videoSize.width) * 100 + '%' } : {}), ...style }}
    >
        <div className="video-player !bg-tertiary-darker">
            <ReactPlayer
                ref={ref}
                height="100%"
                width="100%"
                src={url}
                config={{ youtube: { disablekb: 0, fs: 1 } }}
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
