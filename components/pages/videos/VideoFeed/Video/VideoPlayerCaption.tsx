/*
 * Npm import
 */
import Router from 'next/router';
import React from 'react';
import { Video } from 'rss-feed';

/*
 * Local import
 */

/*
 * Code
 */
type Props = {
    video: Video;
};
class VideoPlayerCaption extends React.PureComponent<Props, {}> {
    public render() {
        const { video } = this.props;

        return (
            <div className="video-player-container">
                <button className="video-player" onClick={this.onVideoClick}>
                    <div className="react-player__preview" style={{ backgroundImage: `url(${video.thumbnail})` }}>
                        <div className="react-player__shadow">
                            <div className="react-player__play-icon" />
                        </div>
                    </div>
                </button>
            </div>
        );
    }
    private onVideoClick = () => {
        Router.push(`/video?id=${this.props.video.id}`);
    };
}

/*
 * Export Default
 */
export default VideoPlayerCaption;
