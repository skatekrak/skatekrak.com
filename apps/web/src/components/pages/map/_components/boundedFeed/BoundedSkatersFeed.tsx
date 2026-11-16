import Map from '@/components/pages/map/mapQuickAccess/Map';

import { sortMaps } from '../../mapQuickAccess/utils';
import { skaterFixtures as maps } from './fixtures';

import type { MapBounds } from '@/lib/hook/useSpotsGeoJSON';

const emptyLabel = 'No skaters in this area.';

type BoundedSkatersFeedProps = {
    bounds?: MapBounds;
};

export const BoundedSkatersFeed = ({ bounds }: BoundedSkatersFeedProps) => {
    if (bounds == null) {
        return <p className="py-12 text-center text-onDark-mediumEmphasis">{emptyLabel}</p>;
    }

    if (maps.length === 0) {
        return <p className="py-12 text-center text-onDark-mediumEmphasis">{emptyLabel}</p>;
    }

    return (
        <div className="grid gap-2 pt-4">
            {sortMaps(maps).map((map) => (
                <Map key={map.id} map={map} onClick={() => undefined} />
            ))}
        </div>
    );
};
