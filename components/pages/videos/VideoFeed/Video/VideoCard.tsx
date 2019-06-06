import { distanceInWordsToNow } from 'date-fns';
import React from 'react';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';

import ClipboardButton from 'components/Ui/Button/ClipboardButton';
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

                <div className="video-card-share">
                    <FacebookShareButton
                        url={this.getVideoPopupUrl(video)}
                        quote={`${video.title} shared via skatekrak.com`}
                    >
                        <FacebookIcon size={24} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={this.getVideoPopupUrl(video)} title={video.title} via="skatekrak">
                        <TwitterIcon size={24} round />
                    </TwitterShareButton>
                    <ClipboardButton value={this.getVideoPopupUrl(video)} />
                </div>

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

    private getVideoPopupUrl(video: Video): string {
        return `${window.location.origin}/video?id=${video.id}`;
    }
}

export default VideoCard;
