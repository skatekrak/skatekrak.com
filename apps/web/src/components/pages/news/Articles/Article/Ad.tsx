import React from 'react';
import Link from 'next/link';

import Typography from '@/components/Ui/typography/Typography';
import * as S from './Article.styled';

import { PATH_CALL_TO_ADVENTURE } from '@/pages/call-to-adventure';

const ArticleAd = () => (
    <S.ArticleAdContainer>
        <S.ArticleAdKrakLogo />
        <S.ArticleAdCTAContainer className="news-article--cta-container">
            <S.ArticleAdCTAText component="subtitle1">
                The first skateboarding
                <br />
                DAO x CO-OP
            </S.ArticleAdCTAText>
            <Link href={PATH_CALL_TO_ADVENTURE}>
                <S.ArticleAdCTA>
                    <Typography component="button">Discover</Typography>
                </S.ArticleAdCTA>
            </Link>
        </S.ArticleAdCTAContainer>
    </S.ArticleAdContainer>
);

export default ArticleAd;
