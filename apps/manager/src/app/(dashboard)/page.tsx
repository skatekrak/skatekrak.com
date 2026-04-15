import { SiteHeader } from '@/components/site-header';

import { LatestMedia } from './_components/latest-media';
import { LatestSpots } from './_components/latest-spots';
import { LatestUsers } from './_components/latest-users';
import { StatsRow } from './_components/stats-row';

export default function DashboardPage() {
    return (
        <>
            <SiteHeader title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                <StatsRow />
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <LatestUsers />
                    <LatestSpots />
                    <LatestMedia />
                </div>
            </div>
        </>
    );
}
