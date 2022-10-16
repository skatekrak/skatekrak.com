import Typography from 'components/Ui/typography/Typography';
import Link from 'next/link';
import React from 'react';

import * as S from './CallToAdventureCTA.styled';

const CallToAdventureCTA = () => {
    return (
        <S.CallToAdventureCTAContainer>
            <Link href="/join">
                <S.CallToAdventureLink>
                    <Typography component="button">
                        Support Krak
                        <br />
                        Become a member
                    </Typography>
                </S.CallToAdventureLink>
            </Link>
        </S.CallToAdventureCTAContainer>
    );
};

export default CallToAdventureCTA;
