import React from 'react';

const MinuteBadge = () => (
    <svg className="map-badge-minute map-badge" viewBox="0 0 20 20">
        <circle className="map-badge-minute-bg" cx="10" cy="10" r="10" />
        <path
            className="map-badge-stroke-outter"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 18.75C14.8325 18.75 18.75 14.8325 18.75 10C18.75 5.16751 14.8325 1.25 10 1.25C5.16751 1.25 1.25 5.16751 1.25 10C1.25 14.8325 5.16751 18.75 10 18.75ZM10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
        />
        <path
            className="map-badge-minute-stroke"
            d="M10,1.25A8.75,8.75,0,1,1,1.25,10,8.76,8.76,0,0,1,10,1.25M10,0A10,10,0,1,0,20,10,10,10,0,0,0,10,0Z"
        />
        <path
            className="map-badge-minute-shape"
            d="M14.25 8.45636V8.39675C14.25 6.08378 12.3423 4.20001 10 4.20001C7.6456 4.20001 5.75 6.08378 5.75 8.39675V8.45636V10.9243H8.52699L5.75 12.8081V15.3714L5.93111 15.2522L9.96378 12.5816H10.0121L14.0689 15.2522L14.25 15.3714V14.06V12.8081L11.4368 10.9243H14.25V8.95711V8.45636Z"
        />
    </svg>
);

export default MinuteBadge;
