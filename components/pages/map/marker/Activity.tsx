import React from 'react';

const Activity = ({ firing }) => (
    <svg
        className={`
            map-marker-activity
            ${firing && 'map-marker-activity-firing'}
        `}
        viewBox="0 0 48 48"
    >
        <circle className="map-marker-activity-inner" opacity="0" cx="24" cy="24" r="24" />
        <circle className="map-marker-activity-middle" opacity="0" cx="24" cy="24" r="24" />
        <circle className="map-marker-activity-outter" opacity="0" cx="24" cy="24" r="24" />
    </svg>
);

export default Activity;
