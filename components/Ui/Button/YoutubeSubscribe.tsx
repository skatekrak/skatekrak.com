import React from 'react';

const YoutubeSubscribe: React.FC = () => (
    <a
        href="https://www.youtube.com/krakskate?sub_confirmation=1"
        target="_blank"
        rel="noreferrer"
        className="youtube-subscribe"
    >
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 180">
            <path
                d="M253.3,38.8c0,0-2.5-17.6-10.2-25.4c-9.7-10.2-20.6-10.2-25.7-10.8C181.7,0,128,0,128,0H128
                       c0,0-53.7,0-89.6,2.6c-5,0.6-15.9,0.6-25.7,10.8C5.1,21.2,2.6,38.8,2.6,38.8S0,59.6,0,80.3v19.4c0,20.7,2.6,41.4,2.6,41.4
                       s2.5,17.6,10.2,25.4c9.7,10.2,22.5,9.9,28.2,10.9c20.5,2,87,2.6,87,2.6s53.8-0.1,89.6-2.7c5-0.6,15.9-0.6,25.7-10.8
                       c7.7-7.8,10.2-25.4,10.2-25.4s2.6-20.7,2.6-41.4V80.3C255.9,59.6,253.3,38.8,253.3,38.8L253.3,38.8z M101.6,123.2V51.3l69.2,36.1
                       L101.6,123.2L101.6,123.2z"
            />
        </svg>
        Subscribe to our youtube channel
    </a>
);

export default YoutubeSubscribe;
