import React from 'react';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';
import ClipboardButton from 'components/Ui/Button/ClipboardButton';

type Props = {
    url: string;
    facebookQuote: string;
    twitterTitle: string;
};

/*
 * Need to be wrapped in a container for placement
 */
const SocialShare = ({ url, facebookQuote, twitterTitle }: Props) => {
    return (
        <>
            <FacebookShareButton url={url} quote={facebookQuote}>
                <FacebookIcon size={24} round />
            </FacebookShareButton>
            <TwitterShareButton url={url} title={twitterTitle} via="skatekrak">
                <TwitterIcon size={24} round />
            </TwitterShareButton>
            <ClipboardButton value={url} />
        </>
    );
};

export default SocialShare;
