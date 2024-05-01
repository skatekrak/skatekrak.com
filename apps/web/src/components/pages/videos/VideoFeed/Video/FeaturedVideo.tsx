import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO';
import React from 'react';

import VideoCardShare from '@/components/pages/videos/VideoFeed/Video/VideoCardShare';
import VideoPlayerCaption from '@/components/pages/videos/VideoFeed/Video/VideoPlayerCaption';
import { IContent } from 'rss-feed';

type Props = {
    video: IContent;
};

class FeaturedVideo extends React.PureComponent<Props> {
    public render() {
        const { video } = this.props;

        return (
            <div className="video-card video-featured">
                <VideoPlayerCaption video={video} />
                <VideoCardShare video={video} />
                <div className="video-featured-details">
                    <p className="video-featured-details-source">
                        by {video.source.title}
                        <span className="video-featured-details-date">
                            &nbsp;- {formatDistanceToNow(parseISO(video.createdAt))}
                        </span>
                    </p>
                </div>
                <h2 className="video-featured-title">{video.title}</h2>
            </div>
        );
    }
}

export default FeaturedVideo;
