import React from 'react';
import Link from 'next/link';

const MapSearchResultNoContent = () => {
    return (
        <div className="map-navigation-search-result-no-content">
            <p>We can’t find this spot in our system</p>
            <span>
                You can create new spots by downloading{' '}
                <Link href={'/app'}>
                    <a>the app</a>
                </Link>
            </span>
        </div>
    );
};

export default MapSearchResultNoContent;
