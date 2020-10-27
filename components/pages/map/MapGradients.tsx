import React from 'react';

const MapGradients = () => {
    return (
        <div id="map-gradients">
            {/* Define svg gradients here */}
            <svg width="0" height="0">
                <defs>
                    {/* Icon */}
                    <linearGradient id="map-gradients-street" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" className="stop-top" />
                        <stop offset="100%" className="stop-bottom" />
                    </linearGradient>
                    <linearGradient id="map-gradients-park" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" className="stop-top" />
                        <stop offset="100%" className="stop-bottom" />
                    </linearGradient>
                    <linearGradient id="map-gradients-shop" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" className="stop-top" />
                        <stop offset="100%" className="stop-bottom" />
                    </linearGradient>
                    <linearGradient id="map-gradients-private" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" className="stop-top" />
                        <stop offset="100%" className="stop-bottom" />
                    </linearGradient>
                    <linearGradient id="map-gradients-diy" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" className="stop-top" />
                        <stop offset="100%" className="stop-bottom" />
                    </linearGradient>
                    <linearGradient id="map-gradients-rip" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" className="stop-top" />
                        <stop offset="60%" className="stop-2" />
                        <stop offset="100%" className="stop-bottom" />
                    </linearGradient>
                    <linearGradient id="map-gradients-wip" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" className="stop-top" />
                        <stop offset="100%" className="stop-bottom" />
                    </linearGradient>
                    {/* Badge */}
                    <linearGradient id="map-gradients-iconic" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#FFEB38" />
                        <stop offset="25%" stopColor="#E6D432" />
                        <stop offset="45%" stopColor="#BDAE28" />
                        <stop offset="65%" stopColor="#FAE634" />
                        <stop offset="100%" stopColor="#766C14" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

export default MapGradients;
