import React from 'react';

import { SourceType } from 'lib/constants';
import VideoPlayerContainer from 'components/Ui/Player/VideoPlayerContainer';
import ScrollBar from 'components/Ui/Scrollbar';

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
    return (
        <ScrollBar maxHeight="100%">
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
    );
};

export default MapFullSpotMainClips;
