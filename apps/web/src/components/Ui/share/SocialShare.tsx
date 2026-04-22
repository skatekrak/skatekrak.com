import React from 'react';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';

import ClipboardButton from '@/components/Ui/Button/ClipboardButton';

type Props = {
    url: string;
    facebookQuote: string;
    twitterTitle: string;
    utmCampaign?: string;
};

const appendUtm = (baseUrl: string, source: string, campaign: string): string => {
    try {
        const u = new URL(baseUrl);
        u.searchParams.set('utm_source', source);
        u.searchParams.set('utm_medium', 'social');
        u.searchParams.set('utm_campaign', campaign);
        return u.toString();
    } catch {
        return baseUrl;
    }
};

/*
 * Need to be wrapped in a container for placement
 */
const SocialShare = ({ url, twitterTitle, utmCampaign }: Props) => {
    const fbUrl = utmCampaign ? appendUtm(url, 'facebook', utmCampaign) : url;
    const twUrl = utmCampaign ? appendUtm(url, 'twitter', utmCampaign) : url;

    return (
        <>
            <FacebookShareButton url={fbUrl}>
                <FacebookIcon size={24} round />
            </FacebookShareButton>
            <TwitterShareButton url={twUrl} title={twitterTitle} via="skatekrak">
                <TwitterIcon size={24} round />
            </TwitterShareButton>
            <ClipboardButton value={url} />
        </>
    );
};

export default SocialShare;
