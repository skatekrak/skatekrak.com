import React, { useEffect, useState } from 'react';

import { SourceType } from 'lib/constants';
import VideoPlayerContainer from 'components/Ui/Player/VideoPlayerContainer';
import ScrollBar from 'components/Ui/Scrollbar';
import useConstant from 'use-constant';

const clips = [
    {
        title: "Skate Invaders - L'intégrale | GQ x Volcom",
        author: 'Volcom',
        source: {
            type: SourceType.YOUTUBE,
        },
        videoId: '7VQLdAZz-ww',
    },
    {
        title: 'Paris? Trust In Dustin Dollin | #TrulyLiveParis | Volcom Skateboarding',
        author: 'Volcom',
        source: {
            type: SourceType.YOUTUBE,
        },
        videoId: 'FdK5nRkWXUw',
    },
];

const MapFullSpotMainClips = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollBarMaxHeight, setScrollBarMaxHeight] = useState('100%');
    const scrollContainer = document.getElementsByClassName('simplebar-content-wrapper')[0];
    const headerElement = document.getElementById('map-full-spot-popup-main-header');

    const handleContainerScroll = (evt) => {
        if (evt.target.scrollTop > 40) {
            setScrollBarMaxHeight('calc(100% - 53px)');
            setIsScrolled(true);
        } else {
            setScrollBarMaxHeight('calc(100% - 117px)');
            setIsScrolled(false);
        }

        if (isScrolled) {
            headerElement.classList.add('map-full-spot-popup-main-header--fixed');
        } else {
            headerElement.classList.remove('map-full-spot-popup-main-header--fixed');
        }
    };

    useEffect(() => {
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleContainerScroll);
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleContainerScroll);
            }
        };
    });

    return (
        <>
            <div id="map-full-spot-popup-main-header">
                <nav id="map-full-spot-popup-main-header-nav">
                    <button className="map-full-spot-popup-main-header-nav-item">recent</button>
                    <button className="map-full-spot-popup-main-header-nav-item">history</button>
                    <button className="map-full-spot-popup-main-header-nav-item">minute</button>
                    <button className="map-full-spot-popup-main-header-nav-item">featured</button>
                </nav>
            </div>
            <ScrollBar maxHeight={scrollBarMaxHeight}>
                <div id="map-full-spot-popup-main">
                    <div id="map-full-spot-popup-main-clips">
                        {clips.map((clip) => (
                            <div key={clip.videoId} className="map-full-spot-popup-main-clip">
                                <h3 className="map-full-spot-popup-main-clip-author">{clip.author}</h3>
                                <h2 className="map-full-spot-popup-main-clip-title">{clip.title}</h2>
                                <VideoPlayerContainer video={clip} />
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollBar>
        </>
    );
};

export default MapFullSpotMainClips;
