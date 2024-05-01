import React from 'react';

import Typography from '@/components/Ui/typography/Typography';
import * as S from './AuthProjectDescription.styled';

const AuthProjectDescription = () => {
    return (
        <S.AuthProjectDescriptionContainer>
            <Typography as="h1" component="condensedHeading4">
                The first skateboarding
                <br />
                DAO x Co-op
            </Typography>
            <S.AuthProjectDescriptionSubtitle component="heading6">
                Let's make sure skateboarding keeps its roots deep in creativity, openness, rebellion & freedom.
            </S.AuthProjectDescriptionSubtitle>
            <S.AuthProjectDescriptionParagraphContainer>
                <Typography>
                    Our mission is to make more skateboarding happen in this world. We build knowledge, ressources and
                    tools for skateboarders, to inspire creative collaboration, cooperation and mutual support within
                    the community.
                </Typography>
                <Typography>Think an open, decentralized, collective Wikipedia focus on skateboarding.</Typography>
                <Typography>And 100% owned by skateboarders.</Typography>
            </S.AuthProjectDescriptionParagraphContainer>
        </S.AuthProjectDescriptionContainer>
    );
};

export default AuthProjectDescription;
