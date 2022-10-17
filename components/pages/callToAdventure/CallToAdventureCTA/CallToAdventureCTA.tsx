import React from 'react';
import Typography from 'components/Ui/typography/Typography';

import * as S from './CallToAdventureCTA.styled';

const CallToAdventureCTA = () => {
    return (
        <S.CallToAdventureCTAContainer>
            <S.CallToAdventureLink href="https://skatekrak.com/join" target="_blank" rel="noopener noreferrer">
                <Typography component="button">
                    Support Krak
                    <br />
                    Become a member
                </Typography>
            </S.CallToAdventureLink>
        </S.CallToAdventureCTAContainer>
    );
};

export default CallToAdventureCTA;
