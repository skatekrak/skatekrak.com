import React from 'react';

import City from '../City';

import cities from '@/data/cities/_cities';

type Props = {
    closeSheet: () => void;
};

const MobileCities: React.FC<Props> = ({ closeSheet }) => {
    return (
        <div className="grid grid-cols-3 px-4 pb-4 sm:grid-cols-4">
            {cities.map((city) => (
                <City key={city.id} city={city} onCityClick={closeSheet} />
            ))}
        </div>
    );
};

export default MobileCities;
