import React from 'react';
import Link from 'next/link';

import IconDiy from '@/components/pages/map/marker/icons/Diy';
import IconPark from '@/components/pages/map/marker/icons/Park';
import IconPrivate from '@/components/pages/map/marker/icons/Private';
import IconRip from '@/components/pages/map/marker/icons/Rip';
import IconShop from '@/components/pages/map/marker/icons/Shop';
import IconStreet from '@/components/pages/map/marker/icons/Street';
import IconWip from '@/components/pages/map/marker/icons/Wip';
import Activity from '@/components/pages/map/marker/Activity';
import BadgeHistory from '@/components/pages/map/marker/badges/History';
import BadgeIconic from '@/components/pages/map/marker/badges/Iconic';
import BadgeMinute from '@/components/pages/map/marker/badges/Minute';

import Typography from '@/components/Ui/typography/Typography';

const Legend = () => {
    return (
        <div className="px-6 pt-2 pb-8 text-onDark-highEmphasis bg-tertiary-dark">
            <Typography className="mb-8 leading-[1.4] text-onDark-mediumEmphasis [&_a]:text-primary-80 [&_a]:underline" component="body2">
                Skateboarding isn't easy. It takes time, passion, effort & learning. But when you're in the flow,
                starting to see things all around you differently, it's incredibly thrilling & addictive. That's why
                we're making this map. There's so much more to come. If you want to be a part of it, please{' '}
                <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://opencollective.com/opensb/projects/krakmap"
                >
                    support us.
                </Link>
            </Typography>

            <Typography className="mb-4 text-primary-80" component="condensedSubtitle1">Categories & status</Typography>
            <ul className="flex flex-wrap">
                <li className="flex items-center w-1/2 mb-2 last:mb-0 [&_svg]:h-7 [&_svg]:w-7 [&_svg]:mr-2">
                    <IconStreet />
                    <Typography component="body2">Street</Typography>
                </li>
                <li className="flex items-center w-1/2 mb-2 last:mb-0 [&_svg]:h-7 [&_svg]:w-7 [&_svg]:mr-2">
                    <IconPark />
                    <Typography component="body2">Park</Typography>
                </li>
                <li className="flex items-center w-1/2 mb-2 last:mb-0 [&_svg]:h-7 [&_svg]:w-7 [&_svg]:mr-2">
                    <IconShop />
                    <Typography component="body2">Shop</Typography>
                </li>
                <li className="flex items-center w-1/2 mb-2 last:mb-0 [&_svg]:h-7 [&_svg]:w-7 [&_svg]:mr-2">
                    <IconPrivate />
                    <Typography component="body2">Private</Typography>
                </li>
                <li className="flex items-center w-1/2 mb-2 last:mb-0 [&_svg]:h-7 [&_svg]:w-7 [&_svg]:mr-2">
                    <IconDiy />
                    <Typography component="body2">DIY [do it yourself]</Typography>
                </li>
                <li className="flex items-center w-1/2 mb-2 last:mb-0 [&_svg]:h-7 [&_svg]:w-7 [&_svg]:mr-2">
                    <IconWip />
                    <Typography component="body2">WIP [work in progress]</Typography>
                </li>
                <li className="flex items-center w-1/2 mb-2 last:mb-0 [&_svg]:h-7 [&_svg]:w-7 [&_svg]:mr-2">
                    <IconRip />
                    <Typography component="body2">RIP [rest in peace]</Typography>
                </li>
            </ul>
            <div className="h-px my-6 mt-6 mb-4 bg-onDark-divider" />
            <Typography className="mb-4 text-primary-80" component="condensedSubtitle1">Tags</Typography>
            <ul className="flex flex-wrap">
                <li className="flex items-center mb-3 mr-4 last:mr-0 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:mr-2">
                    <BadgeIconic />
                    <Typography component="body2">Famous</Typography>
                </li>
                <li className="flex items-center mb-3 mr-4 last:mr-0 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:mr-2">
                    <BadgeHistory />
                    <Typography component="body2">History Clip</Typography>
                </li>
                <li className="flex items-center mb-3 mr-4 last:mr-0 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:mr-2">
                    <BadgeMinute />
                    <Typography component="body2">Minute</Typography>
                </li>
            </ul>

            <div className="h-px my-6 mt-6 mb-4 bg-onDark-divider" style={{ marginTop: '0.75rem' }} />

            <Typography className="mb-4 text-primary-80" component="condensedSubtitle1">
                Activity [amount of media uploaded]
            </Typography>
            <ul className="flex flex-wrap justify-around">
                <li className="flex flex-col items-center mt-4 [&_.map-marker-activity]:w-9 [&_.map-marker-activity]:h-9 [&_.map-marker-activity]:-z-[1] [&_.map-marker-activity-inner]:![animation:none] [&_.map-marker-activity-middle]:![animation:none] [&_.map-marker-activity-outter]:![animation:none] [&_.map-marker-activity-firing]:!transform-none [&_.map-marker-activity-firing_.map-marker-activity-inner]:scale-[0.3] [&_.map-marker-activity-firing_.map-marker-activity-inner]:opacity-40 [&_.map-marker-activity-firing_.map-marker-activity-middle]:scale-75 [&_.map-marker-activity-firing_.map-marker-activity-middle]:opacity-30 [&_.map-marker-activity-firing_.map-marker-activity-outter]:scale-[1.2] [&_.map-marker-activity-firing_.map-marker-activity-outter]:opacity-[0.15] [&_.map-badge]:w-full last:[&_.map-marker-activity-inner]:scale-[0.7] last:[&_.map-marker-activity-inner]:opacity-40 last:[&_.map-marker-activity-middle]:scale-[1.2] last:[&_.map-marker-activity-middle]:opacity-20 last:[&_.map-marker-activity-outter]:scale-[1.7] last:[&_.map-marker-activity-outter]:opacity-20">
                    <div className="relative w-9 h-12 z-[1]">
                        <IconStreet />
                        <div className="absolute -top-[7px] left-[calc(100%-13px)] flex items-center h-4 w-4 z-[1]">
                            <BadgeIconic />
                        </div>
                    </div>
                    {'< 10'}
                </li>
                <li className="flex flex-col items-center mt-4 [&_.map-marker-activity]:w-9 [&_.map-marker-activity]:h-9 [&_.map-marker-activity]:-z-[1] [&_.map-marker-activity-inner]:![animation:none] [&_.map-marker-activity-middle]:![animation:none] [&_.map-marker-activity-outter]:![animation:none] [&_.map-marker-activity-firing]:!transform-none [&_.map-marker-activity-firing_.map-marker-activity-inner]:scale-[0.3] [&_.map-marker-activity-firing_.map-marker-activity-inner]:opacity-40 [&_.map-marker-activity-firing_.map-marker-activity-middle]:scale-75 [&_.map-marker-activity-firing_.map-marker-activity-middle]:opacity-30 [&_.map-marker-activity-firing_.map-marker-activity-outter]:scale-[1.2] [&_.map-marker-activity-firing_.map-marker-activity-outter]:opacity-[0.15] [&_.map-badge]:w-full last:[&_.map-marker-activity-inner]:scale-[0.7] last:[&_.map-marker-activity-inner]:opacity-40 last:[&_.map-marker-activity-middle]:scale-[1.2] last:[&_.map-marker-activity-middle]:opacity-20 last:[&_.map-marker-activity-outter]:scale-[1.7] last:[&_.map-marker-activity-outter]:opacity-20">
                    <div className="relative w-9 h-12 z-[1]">
                        <IconStreet />
                        <div className="absolute -top-[7px] left-[calc(100%-13px)] flex items-center h-4 w-4 z-[1]">
                            <BadgeIconic />
                        </div>
                        <Activity firing />
                    </div>
                    {'< 30'}
                </li>
                <li className="flex flex-col items-center mt-4 [&_.map-marker-activity]:w-9 [&_.map-marker-activity]:h-9 [&_.map-marker-activity]:-z-[1] [&_.map-marker-activity-inner]:![animation:none] [&_.map-marker-activity-middle]:![animation:none] [&_.map-marker-activity-outter]:![animation:none] [&_.map-marker-activity-firing]:!transform-none [&_.map-marker-activity-firing_.map-marker-activity-inner]:scale-[0.3] [&_.map-marker-activity-firing_.map-marker-activity-inner]:opacity-40 [&_.map-marker-activity-firing_.map-marker-activity-middle]:scale-75 [&_.map-marker-activity-firing_.map-marker-activity-middle]:opacity-30 [&_.map-marker-activity-firing_.map-marker-activity-outter]:scale-[1.2] [&_.map-marker-activity-firing_.map-marker-activity-outter]:opacity-[0.15] [&_.map-badge]:w-full last:[&_.map-marker-activity-inner]:scale-[0.7] last:[&_.map-marker-activity-inner]:opacity-40 last:[&_.map-marker-activity-middle]:scale-[1.2] last:[&_.map-marker-activity-middle]:opacity-20 last:[&_.map-marker-activity-outter]:scale-[1.7] last:[&_.map-marker-activity-outter]:opacity-20">
                    <div className="relative w-9 h-12 z-[1]">
                        <IconStreet />
                        <div className="absolute -top-[7px] left-[calc(100%-13px)] flex items-center h-4 w-4 z-[1]">
                            <BadgeIconic />
                        </div>
                        <Activity firing />
                    </div>
                    {'> 30'}
                </li>
            </ul>
        </div>
    );
};

export default React.memo(Legend);
