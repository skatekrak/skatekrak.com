import React from 'react';

import QuickAccessDesktopCities from './quick-access-desktop.cities';
import QuickAccessDesktopMaps from './quick-access-desktop.maps';

const QuickAccessDesktop = () => {
    return (
        <div className="hidden lg:flex absolute top-6 right-6 flex-col items-center py-2 bg-tertiary-dark border border-solid border-tertiary-medium rounded shadow-onDarkHighSharp z-[1000]">
            <QuickAccessDesktopCities />
            <QuickAccessDesktopMaps />
        </div>
    );
};

export default React.memo(QuickAccessDesktop);
