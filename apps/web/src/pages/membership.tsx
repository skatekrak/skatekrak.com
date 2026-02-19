import React from 'react';

import Layout from '@/components/Layout';
import Typography from '@/components/Ui/typography/Typography';
import Link from 'next/link';
import { PATH_CALL_TO_ADVENTURE } from './call-to-adventure';

export const PATH_MEMBERSHIP = '/membership';

const Membership = () => {
    return (
        <Layout>
            <div className="grow w-full py-24 text-onDark-highEmphasis bg-tertiary-dark">
                <div className="flex flex-col w-full mx-auto px-6 tablet:max-w-[32rem] tablet:px-0">
                    <a
                        className="relative py-1 px-6 mx-auto mt-8 mb-16 text-center text-onLight-highEmphasis bg-onDark-highEmphasis rounded cursor-pointer laptop-s:py-2 laptop-s:px-6 [&_.ui-Typography]:laptop-s:text-base after:laptop-s:content-[''] after:laptop-s:absolute after:laptop-s:top-2 after:laptop-s:left-2 after:laptop-s:w-full after:laptop-s:h-full after:laptop-s:border after:laptop-s:border-onDark-mediumEmphasis after:laptop-s:rounded after:laptop-s:transition-all after:laptop-s:duration-100 after:laptop-s:ease-in-out hover:after:laptop-s:top-0 hover:after:laptop-s:left-0"
                        href="https://opencollective.com/opensb/projects/krakmap"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Typography component="button">
                            Support Krak
                            <br />
                            Become a member
                        </Typography>
                    </a>
                    <div className="text-onDark-mediumEmphasis [&_ul]:my-6 [&_li]:list-disc [&_li]:list-inside [&_li]:mb-2 [&_.ui-Typography]:text-lg [&_.ui-Typography]:inline [&_a]:text-onDark-highEmphasis [&_a]:underline">
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
                            <Link href={PATH_CALL_TO_ADVENTURE}>Call-to-Adventure</Link>
                            .
                            <br />
                            <br />
                            Our forever promise? This is a community asset, 100% owned by skateboarders.
                        </Typography>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Membership;
