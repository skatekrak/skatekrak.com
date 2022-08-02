import React from 'react';

import SocialShare from 'components/Ui/share/SocialShare';
import * as S from '../MapFullSpotMain.styled';

import { Media } from 'lib/carrelageClient';

type Props = {
    media: Media;
    spotId: string;
};

const MapFullSpotMediaShare = ({ media, spotId }: Props) => {
    const url = `${window.location.origin}?modal=1&spot=${spotId}&media=${media.id}`;
    return (
        <S.MapFullSpotMainMediaShare>
            <SocialShare
                url={url}
                facebookQuote={`${media.caption} shared via skatekrak.com`}
                twitterTitle={media.caption}
            />
        </S.MapFullSpotMainMediaShare>
    );
};

export default MapFullSpotMediaShare;
