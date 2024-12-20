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

import * as S from './Legend.styled';
import Typography from '@/components/Ui/typography/Typography';

const Legend = () => {
    return (
        <S.LegendContainer>
            <S.LegendDescription component="body2">
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
            </S.LegendDescription>

            <S.LegendSectionTitle component="condensedSubtitle1">Categories & status</S.LegendSectionTitle>
            <S.LegendSectionContainer>
                <S.LegendCategory>
                    <IconStreet />
                    <Typography component="body2">Street</Typography>
                </S.LegendCategory>
                <S.LegendCategory>
                    <IconPark />
                    <Typography component="body2">Park</Typography>
                </S.LegendCategory>
                <S.LegendCategory>
                    <IconShop />
                    <Typography component="body2">Shop</Typography>
                </S.LegendCategory>
                <S.LegendCategory>
                    <IconPrivate />
                    <Typography component="body2">Private</Typography>
                </S.LegendCategory>
                <S.LegendCategory>
                    <IconDiy />
                    <Typography component="body2">DIY [do it yourself]</Typography>
                </S.LegendCategory>
                <S.LegendCategory>
                    <IconWip />
                    <Typography component="body2">WIP [work in progress]</Typography>
                </S.LegendCategory>
                <S.LegendCategory>
                    <IconRip />
                    <Typography component="body2">RIP [rest in peace]</Typography>
                </S.LegendCategory>
            </S.LegendSectionContainer>
            <S.LegendSectionDivider />
            <S.LegendSectionTitle component="condensedSubtitle1">Tags</S.LegendSectionTitle>
            <S.LegendSectionContainer>
                <S.LegendTag>
                    <BadgeIconic />
                    <Typography component="body2">Famous</Typography>
                </S.LegendTag>
                <S.LegendTag>
                    <BadgeHistory />
                    <Typography component="body2">History Clip</Typography>
                </S.LegendTag>
                <S.LegendTag>
                    <BadgeMinute />
                    <Typography component="body2">Minute</Typography>
                </S.LegendTag>
            </S.LegendSectionContainer>

            <S.LegendSectionDivider marginTop="0.75rem" />

            <S.LegendSectionTitle component="condensedSubtitle1">
                Activity [amount of media uploaded]
            </S.LegendSectionTitle>
            <S.LegendActivitiesContainer>
                <S.LegendActivity>
                    <S.LegendActivityMarker>
                        <IconStreet />
                        <S.LegendActivityBadge>
                            <BadgeIconic />
                        </S.LegendActivityBadge>
                    </S.LegendActivityMarker>
                    {'< 10'}
                </S.LegendActivity>
                <S.LegendActivity>
                    <S.LegendActivityMarker>
                        <IconStreet />
                        <S.LegendActivityBadge>
                            <BadgeIconic />
                        </S.LegendActivityBadge>
                        <Activity firing />
                    </S.LegendActivityMarker>
                    {'< 30'}
                </S.LegendActivity>
                <S.LegendActivity>
                    <S.LegendActivityMarker>
                        <IconStreet />
                        <S.LegendActivityBadge>
                            <BadgeIconic />
                        </S.LegendActivityBadge>
                        <Activity firing />
                    </S.LegendActivityMarker>
                    {'> 30'}
                </S.LegendActivity>
            </S.LegendActivitiesContainer>
        </S.LegendContainer>
    );
};

export default React.memo(Legend);
