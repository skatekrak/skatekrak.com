import React from 'react';

import VideoPlayer from 'components/Ui/Player/VideoPlayer';
import { Video } from 'rss-feed';

type Props = {
    video: Video;
};

type State = {};

class FeaturedVideo extends React.PureComponent<Props, State> {
    public render() {
        const { video } = this.props;

        return (
            <div className="video-card video-featured">
                <VideoPlayer url={`https://www.youtube.com/watch?v=${video.videoId}`} controls light playing />
                <h2 className="video-featured-title">{video.title}</h2>
            </div>
        );
    }
}

export default FeaturedVideo;
