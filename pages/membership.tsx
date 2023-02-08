import React from 'react';

import Layout from 'components/Layout';
import Typography from 'components/Ui/typography/Typography';
import * as S from 'components/Ui/pages/OneColumnPage.styled';
import Link from 'next/link';
import { PATH_CALL_TO_ADVENTURE } from './call-to-adventure';

export const PATH_MEMBERSHIP = '/membership';

const Membership = () => {
    return (
        <Layout>
            <S.OneColumnPage>
                <S.OneColumnPageInnerContainer>
                    <S.CTA href="https://skatekrak.com/join" target="_blank" rel="noopener noreferrer">
                        <Typography component="button">
                            Support Krak
                            <br />
                            Become a member
                        </Typography>
                    </S.CTA>
                    <S.OneColumnPageContent>
                        <Typography>
                            Subscribe for $50 a year and be part of a release club where we - skateboarders -
                            collaborate to drop and support work together. This money joins a common treasury and allows
                            everything to (a) stay sustainable over time and (b) grow and become more impactful.
                        </Typography>
                        <ul>
                            <li>
                                <Typography>take part of the discussions about what to build and release</Typography>
                            </li>
                            <li>
                                <Typography>join some private spaces to meet other members</Typography>
                            </li>
                            <li>
                                <Typography>enjoy an early access to every future release</Typography>
                            </li>
                            <li>
                                <Typography>
                                    unlock members-only benefits [like a couchsurfing directory; or the ability to
                                    co-write the newsletter; and much more]
                                </Typography>
                            </li>
                            <li>
                                <Typography>receive special gifts along the way</Typography>
                            </li>
                            <li>
                                <Typography>own a part of all this</Typography>
                            </li>
                        </ul>
                        <Typography>
                            Still have some doubts and questions? If you need to dig more into what this is all about,
                            pour you a drink, sit down, and enjoy our{' '}
                            <Link href={PATH_CALL_TO_ADVENTURE}>
                                <a>Call-to-Adventure</a>
                            </Link>
                            .
                            <br />
                            <br />
                            Our forever promise? This is a community asset, 100% owned by skateboarders.
                        </Typography>
                    </S.OneColumnPageContent>
                </S.OneColumnPageInnerContainer>
            </S.OneColumnPage>
        </Layout>
    );
};

export default Membership;
