import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { orpc } from '@/server/orpc/client';

import City from '../City';

type Props = {
    closeSheet: () => void;
};

const MobileCities: React.FC<Props> = ({ closeSheet }) => {
    const { data: cities = [] } = useQuery(orpc.cities.list.queryOptions({}));

    return (
        <div className="grid grid-cols-3 px-4 pb-4 mobile:grid-cols-4">
            {cities.map((city) => (
                <City key={city.id} city={city} onCityClick={closeSheet} />
            ))}
        </div>
    );
};

export default MobileCities;
