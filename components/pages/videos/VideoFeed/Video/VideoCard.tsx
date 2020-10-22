import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO';
import React from 'react';

import VideoCardShare from 'components/pages/videos/VideoFeed/Video/VideoCardShare';
import VideoPlayerCaption from 'components/pages/videos/VideoFeed/Video/VideoPlayerCaption';
import { Video } from 'rss-feed';

type Props = {
    video: Video;
};

const VideoCard = ({ video }: Props) => (
    <div className="video-card">
        <VideoPlayerCaption video={video} />
        <VideoCardShare video={video} />
        <div className="video-card-details">
            <p className="video-card-details-source">
                by {video.source.title}
                <span className="video-card-details-date">
                    &nbsp;- {formatDistanceToNow(parseISO(video.createdAt))}
                </span>
            </p>
        </div>
        <h2 className="video-card-title">{video.title}</h2>
    </div>
);

export default React.memo(VideoCard);
