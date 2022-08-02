import React from 'react';

import SocialShare from 'components/Ui/share/SocialShare';
import { IContent } from 'rss-feed';

type Props = {
    video: IContent;
};

class VideoCardShare extends React.PureComponent<Props> {
    public render() {
        const { video } = this.props;

        return (
            <div className="video-card-share">
                <SocialShare
                    url={this.getVideoPopupUrl(video)}
                    facebookQuote={`${video.title} shared via skatekrak.com`}
                    twitterTitle={video.title}
                />
            </div>
        );
    }

    private getVideoPopupUrl(video: IContent): string {
        return `${window.location.origin}/video?id=${video.id}`;
    }
}

export default VideoCardShare;
