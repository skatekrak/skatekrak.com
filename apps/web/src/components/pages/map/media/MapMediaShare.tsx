import React from 'react';

import type { Media } from '@krak/contracts';

import SocialShare from '@/components/Ui/share/SocialShare';

type Props = {
    media: Media;
    url: string;
};

const MapMediaShare = ({ media, url }: Props) => {
    return (
        <div className="absolute top-2 left-3 hidden group-hover:flex z-10">
            <SocialShare
                url={url}
                facebookQuote={`${media.caption} shared via skatekrak.com`}
                twitterTitle={media.caption ?? ''}
                utmCampaign="map_awareness"
            />
        </div>
    );
};

export default MapMediaShare;
