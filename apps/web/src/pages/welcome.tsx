import React from 'react';

import Layout from '@/components/Layout';
import Typography from '@/components/Ui/typography/Typography';
import Link from 'next/link';
import Emoji from '@/components/Ui/Icons/Emoji';

export const PATH_WELCOME = '/welcome';

const Membership = () => {
    return (
        <Layout>
            <div className="grow w-full py-24 text-onDark-highEmphasis bg-tertiary-dark">
                <div className="flex flex-col w-full mx-auto px-6 tablet:max-w-[32rem] tablet:px-0">
                    <Typography component="heading4">
                        <Emoji symbol="💫" />
                        <Emoji symbol="🤝" />
                    </Typography>
                    <div className="text-onDark-mediumEmphasis [&_ul]:my-6 [&_li]:list-disc [&_li]:list-inside [&_li]:mb-2 [&_.ui-Typography]:text-lg [&_.ui-Typography]:inline [&_a]:text-onDark-highEmphasis [&_a]:underline">
                        <Typography>
                            All good - you are now part of the squad.
                            <br />
                            Thank you for your support and let's create magic altogether.
                            <br />
                            <br />
                            We'll contact you on the email you used for the checkout. Meanwhile, feel free to jump on{' '}
                            <Link href="https://discord.gg/exMAqSuVfj" target="_blank" rel="noopener noreferrer">
                                Discord{' '}
                            </Link>
                            and say hi.
                            <br />
                            <br />
                            Keep on pushing, peace & love ✌️
                        </Typography>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Membership;
