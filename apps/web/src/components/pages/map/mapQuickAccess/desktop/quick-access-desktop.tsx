import React from 'react';

import ScrollBar from '@/components/Ui/Scrollbar';

import QuickAccessDesktopCities from './quick-access-desktop.cities';
import QuickAccessDesktopFamous from './quick-access-desktop.famous';
import QuickAccessDesktopMaps from './quick-access-desktop.maps';

const QuickAccessDesktop = () => {
    return (
        <div className="hidden laptop-s:flex absolute top-6 right-6 flex-col items-center py-2 bg-tertiary-dark border border-solid border-tertiary-medium rounded shadow-onDarkHighSharp z-1000">
            <ScrollBar maxHeight="calc(100vh - 19rem)">
                <QuickAccessDesktopCities />
                <QuickAccessDesktopFamous />
                <QuickAccessDesktopMaps />
            </ScrollBar>
        </div>
    );
};

export default React.memo(QuickAccessDesktop);
