import { distanceInWordsToNow } from 'date-fns';
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
                <div className="video-featured-details">
                    <p className="video-featured-details-source">
                        by {video.source.title}
                        <span className="video-featured-details-date">
                            &nbsp;- {distanceInWordsToNow(video.createdAt)}
                        </span>
                    </p>
                </div>
                <h2 className="video-featured-title">{video.title}</h2>
            </div>
        );
    }
}

export default FeaturedVideo;
