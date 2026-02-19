import React from 'react';
import Link from 'next/link';

import Typography from '@/components/Ui/typography/Typography';
import KrakLogoHand from '@/components/Ui/branding/KrakLogoHand';

import { PATH_CALL_TO_ADVENTURE } from '@/pages/call-to-adventure';

const ArticleAd = () => (
    <div className="flex flex-col justify-between min-h-48 h-full p-6 bg-[url('/images/club-presentation-bg.jpg')] bg-cover bg-center rounded">
        <KrakLogoHand className="w-4/5 max-w-[10rem] mx-auto py-4 pb-8 fill-onDark-highEmphasis" />
        <div className="flex flex-col mobile:mx-auto tablet:mx-0">
            <Typography className="mb-3 text-onDark-highEmphasis text-center laptop-s:mb-4" component="subtitle1">
                The first skateboarding
                <br />
                DAO x CO-OP
            </Typography>
            <Link href={PATH_CALL_TO_ADVENTURE}>
                <a className="py-2 px-4 font-roboto-bold text-center text-onDark-highEmphasis rounded bg-primary-80 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.25)] transition-all duration-200 cursor-pointer hover:bg-primary-100">
                    <Typography component="button">Discover</Typography>
                </a>
            </Link>
        </div>
    </div>
);

export default ArticleAd;
