import React from 'react';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';

import ClipboardButton from 'components/Ui/Button/ClipboardButton';
import { Video } from 'rss-feed';

type Props = {
    video: Video;
};

class VideoCardShare extends React.PureComponent<Props> {
    public render() {
        const { video } = this.props;

        return (
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
        );
    }

    private getVideoPopupUrl(video: Video): string {
        return `${window.location.origin}/video?id=${video.id}`;
    }
}

export default VideoCardShare;
