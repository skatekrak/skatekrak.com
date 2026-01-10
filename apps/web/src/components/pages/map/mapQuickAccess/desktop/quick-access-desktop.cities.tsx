import React from 'react';

import QuickAccessDesktopPanel from './quick-access-desktop.panel';
import City from '../City';

import cities from '@/data/cities/_cities';

const category = {
    name: 'Cities',
    edito: 'Fly directly to some major cities for skateboarding.',
    displayedCityImage: 'paris',
};

const QuickAccessDesktopCities = () => {
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
