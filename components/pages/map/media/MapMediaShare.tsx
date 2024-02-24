import React from 'react';

import SocialShare from 'components/Ui/share/SocialShare';
import * as S from './MapMedia.styled';

import { Media } from 'lib/carrelageClient';

type Props = {
    media: Media;
    url: string;
};

const MapMediaShare = ({ media, url }: Props) => {
    return (
        <S.MapMediaShare>
            <SocialShare
                url={url}
                facebookQuote={`${media.caption} shared via skatekrak.com`}
                twitterTitle={media.caption ?? ''}
            />
        </S.MapMediaShare>
    );
};

export default MapMediaShare;
