import { distanceInWordsToNow } from 'date-fns';
import React from 'react';

import VideoPlayer from 'components/Ui/Player/VideoPlayer';
import { Video } from 'rss-feed';

type Props = {
    video: Video;
};

type State = {};

class VideoCard extends React.PureComponent<Props, State> {
    public render() {
        const { video } = this.props;

        return (
            <div className="video-card">
                <VideoPlayer url={`https://www.youtube.com/watch?v=${video.videoId}`} controls light playing />
                <div className="video-card-details">
                    <p className="video-card-details-source">
                        by {video.source.title}
                        <span className="video-card-details-date">&nbsp;- {distanceInWordsToNow(video.createdAt)}</span>
                    </p>
                </div>
                <h2 className="video-card-title">{video.title}</h2>
            </div>
        );
    }
}

export default VideoCard;
