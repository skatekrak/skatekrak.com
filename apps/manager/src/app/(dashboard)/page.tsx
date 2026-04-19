import { SiteHeader } from '@/components/site-header';

import { LatestClips } from './_components/latest-clips';
import { LatestMedia } from './_components/latest-media';
import { LatestUsers } from './_components/latest-users';
import { SpotTypeChart } from './_components/spot-type-chart';

export default function DashboardPage() {
  return (
    <>
      <SiteHeader title="Dashboard" />
      <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SpotTypeChart />
          <LatestMedia />
          <LatestUsers />
          <LatestClips />
        </div>
      </div>
    </>
  );
}
