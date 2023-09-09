import React from 'react';

import Layout from 'components/Layout';
import Typography from 'components/Ui/typography/Typography';
import * as S from 'components/Ui/pages/OneColumnPage.styled';
import Link from 'next/link';
import Emoji from 'components/Ui/Icons/Emoji';

export const PATH_WELCOME = '/welcome';

const Membership = () => {
    return (
        <Layout>
            <S.OneColumnPage>
                <S.OneColumnPageInnerContainer>
                    <Typography component="heading4">
                        <Emoji symbol="💫" />
                        <Emoji symbol="🤝" />
                    </Typography>
                    <S.OneColumnPageContent>
                        <Typography>
                            All good - you are now part of the squad.
                            <br />
                            Thank you for your support and let’s create magic altogether.
                            <br />
                            <br />
                            We’ll contact you on the email you used for the checkout. Meanwhile, feel free to jump on{' '}
                            <Link href="https://discord.gg/exMAqSuVfj" target="_blank" rel="noopener noreferrer">
                                Discord{' '}
                            </Link>
                            and say hi.
                            <br />
                            <br />
                            Keep on pushing, peace & love ✌️
                        </Typography>
                    </S.OneColumnPageContent>
                </S.OneColumnPageInnerContainer>
            </S.OneColumnPage>
        </Layout>
    );
};

export default Membership;
