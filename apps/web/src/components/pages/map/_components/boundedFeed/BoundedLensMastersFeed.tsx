import { Camera, Video } from 'lucide-react';

import { MapCategory, mapCategoryLabels } from '@krak/contracts';

import Map from '@/components/pages/map/mapQuickAccess/Map';

import { sortMaps } from '../../mapQuickAccess/utils';
import { lensMasterFixtures as maps } from './fixtures';

import type { MapBounds } from '@/lib/hook/useSpotsGeoJSON';

type Category = {
    name: MapCategory;
    icon: React.ReactNode;
};

const photographerCategory: Category = {
    name: 'photographer',
    icon: <Camera />,
};

const filmerCategory: Category = {
    name: 'filmer',
    icon: <Video />,
};

const getMapCategory = (categories: string[]) => {
    const photographer = categories.indexOf(mapCategoryLabels.photographer);
    const filmer = categories.indexOf(mapCategoryLabels.filmer);

    if (photographer === -1) return filmerCategory;
    if (filmer === -1) return photographerCategory;

    return photographer < filmer ? photographerCategory : filmerCategory;
};

const emptyLabel = 'No lens masters in this area.';

type BoundedLensMastersFeedProps = {
    bounds?: MapBounds;
};

export const BoundedLensMastersFeed = ({ bounds }: BoundedLensMastersFeedProps) => {
    if (bounds == null) {
        return <p className="py-12 text-center text-onDark-mediumEmphasis">{emptyLabel}</p>;
    }

    if (maps.length === 0) {
        return <p className="py-12 text-center text-onDark-mediumEmphasis">{emptyLabel}</p>;
    }

    return (
        <div className="grid gap-2 pt-4">
            {sortMaps(maps).map((map) => (
                <Map
                    key={map.id}
                    map={map}
                    onClick={() => undefined}
                    category={map.categories && getMapCategory(map.categories)}
                />
            ))}
        </div>
    );
};
