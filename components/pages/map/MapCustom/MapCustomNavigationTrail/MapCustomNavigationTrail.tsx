import React from 'react';
import MapCustomNavigationItem from './MapCustomNavigationItem';

const maps = [
    {
        name: 'The boarder out tour',
        desc: 'The description if any goes here, why this map has been created for example.',
        nbSpot: 6,
    },
    {
        name: 'Nike teenage tour',
        desc:
            'Vivamus finibus convallis mauris nec facilisis. Ut eu orci sit amet enim tempor eleifend. Praesent consequat justo quis sapien tincidunt auctor.',
        nbSpot: 14,
    },
    {
        name: 'A propos',
        desc:
            'Nulla vel semper metus. Pellentesque auctor, diam id semper maximus, ipsum magna volutpat nisi, at rutrum ligula ante eget mi. Aliquam condimentum, urna sit amet vulputate vestibulum, quam tellus rutrum nunc, a posuere eros nulla sed massa. Duis at felis scelerisque, rhoncus turpis quis, dignissim ex.',
        nbSpot: 8,
    },
    {
        name: 'Jenkem',
        desc:
            'Aenean vitae ipsum iaculis massa placerat eleifend a eget sapien. Fusce sagittis, turpis at lobortis elementum, quam nulla eleifend augue, ac luctus eros urna mattis diam. Donec ultricies, nisl et lobortis vestibulum, metus elit pharetra turpis, sit amet facilisis justo neque non turpis. Nullam ut erat eget magna volutpat lobortis non id risus. Donec blandit condimentum urna, consequat ultricies libero sagittis eu. Donec bibendum arcu dui. Vestibulum felis tortor, commodo ac arcu sed, ultrices iaculis justo. Aenean interdum lobortis dignissim.',
        nbSpot: 53,
    },
];

const MapCustomNavigationTrail = () => {
    return (
        <div id="custom-map-navigation-trail">
            {maps.map((map) => (
                <MapCustomNavigationItem map={map} />
            ))}
        </div>
    );
};

export default MapCustomNavigationTrail;
