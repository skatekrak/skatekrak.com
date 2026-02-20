import React from 'react';

import SocialShare from '@/components/Ui/share/SocialShare';
import { IContent } from 'rss-feed';

type Props = {
    video: IContent;
};

const VideoCardShare: React.FC<Props> = ({ video }) => {
    const getVideoPopupUrl = (v: IContent): string => `${window.location.origin}/video?id=${v.id}`;

    return (
        <div className="video-card-share">
            <SocialShare
                url={getVideoPopupUrl(video)}
                facebookQuote={`${video.title} shared via skatekrak.com`}
                twitterTitle={video.title}
            />
        </div>
    );
};

export default VideoCardShare;
