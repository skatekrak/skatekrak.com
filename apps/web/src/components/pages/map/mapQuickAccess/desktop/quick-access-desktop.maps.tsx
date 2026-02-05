import React from 'react';
import { useRouter } from 'next/router';
import { alphabetical } from 'radash';

import Typography from '@/components/Ui/typography/Typography';
import QuickAccessDesktopPanel from './quick-access-desktop.panel';
import Map from '../Map';

import { QuickAccessMap, Category as TCategory } from '../types';
import { generateCategories } from '../utils';
import { trpc } from '@/server/trpc/utils';

const isCategorySelected = (category: TCategory, mapId: string | string[]) =>
    category.maps.some((map) => map.id === mapId);

const sortMaps = (maps: QuickAccessMap[]) => alphabetical(maps, (map) => map.name);

const QuickAccessDesktopMaps = () => {
    const router = useRouter();

    const { isLoading, data } = trpc.maps.list.useQuery();

    return (
        <>
            {!isLoading &&
                data &&
                generateCategories(data).map((category) => (
                    <QuickAccessDesktopPanel
                        key={category.id}
                        isSelected={isCategorySelected(category, router.query.id ?? '')}
                        src={`/images/map/custom-maps/${sortMaps(category.maps)[0].id}.png`}
                        tooltipText={category.name}
                        panelContent={(closePanel) => (
                            <div className="p-6">
                                <Typography component="condensedHeading5" className="mb-6 text-onDark-highEmphasis">
                                    {category.name}
                                </Typography>
                                <div className="grid gap-2">
                                    {sortMaps(category.maps).map((map) => (
                                        <Map key={map.id} map={map} onClick={closePanel} />
                                    ))}
                                </div>
                            </div>
                        )}
                    />
                ))}
        </>
    );
};

export default QuickAccessDesktopMaps;
