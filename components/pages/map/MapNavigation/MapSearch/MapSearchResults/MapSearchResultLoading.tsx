import React from 'react';

const MapSearchResultLoading = () => {
    return (
        <div className="map-navigation-search-result-loading">
            <span className="skeleton-circle" />
            <div className="skeleton-container-start">
                <span className="skeleton-box" />
                <span className="skeleton-box" />
            </div>
            <div className="skeleton-container-end">
                <span className="skeleton-box" />
                <span className="skeleton-box" />
            </div>
        </div>
    );
};

export default MapSearchResultLoading;
