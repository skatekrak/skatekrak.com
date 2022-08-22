import React from 'react';

import Layout from 'components/Layout';
import * as S from 'components/pages/callToAdventure/CallToAdventure.styled';
import Typography from 'components/Ui/typography/Typography';

const CallToAdventure = () => {
    return (
        <Layout>
            <S.CallToAdventurePageContainer>
                <S.CallToAdventureContent>
                    <S.CallToAdventureH1 as="h1">
                        The first
                        <br />
                        skateboarding
                        <br />
                        DAO <span>x</span> Co-op
                    </S.CallToAdventureH1>
                    <S.CallToAdventureIntro component="heading5">
                        Let's make sure skateboarding keeps its roots deep in creativity, openness, rebellion & freedom.
                    </S.CallToAdventureIntro>
                    <S.CallToAdventureBody>
                        Our mission is to make more skateboarding happen in this world. We build knowledge, ressources
                        and tools for skateboarders, to inspire creative collaboration, cooperation and mutual support
                        within the community.
                        <br />
                        <br />
                        Think an open, decentralized, collective Wikipedia focus on skateboarding.
                        <br />
                        <br />
                        And 100% owned by skateboarders.
                    </S.CallToAdventureBody>
                    <S.CallToAdventureIsTyping>
                        <Typography as="span" component="subtitle1">
                            Krak{' '}
                        </Typography>
                        <Typography as="span">is typing...</Typography>
                    </S.CallToAdventureIsTyping>
                </S.CallToAdventureContent>
            </S.CallToAdventurePageContainer>
        </Layout>
    );
};

export default CallToAdventure;
