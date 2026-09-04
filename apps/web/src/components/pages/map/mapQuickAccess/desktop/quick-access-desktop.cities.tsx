import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { orpc } from '@/server/orpc/client';

import City from '../City';
import QuickAccessDesktopPanel from './quick-access-desktop.panel';

const category = {
    name: 'Cities',
    edito: 'Fly directly to some major cities for skateboarding.',
    displayedCityImage: 'paris',
};

const QuickAccessDesktopCities = () => {
    const { data: cities = [] } = useQuery(orpc.cities.list.queryOptions({}));

    return (
        <QuickAccessDesktopPanel
            isSelected={false}
            src={`/images/map/cities/${category.displayedCityImage}.jpg`}
            tooltipText={category.name}
            panelContent={(closePanel) => (
                <div className="grid grid-cols-4 p-4">
                    {cities.map((city) => (
                        <City key={city.id} city={city} onCityClick={closePanel} />
                    ))}
                </div>
            )}
        />
    );
};

export default QuickAccessDesktopCities;
