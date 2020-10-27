import React from 'react';

import VideoPlayerContainer from 'components/Ui/Player/VideoPlayerContainer';
import ScrollBar from 'components/Ui/Scrollbar';
import { Clip } from 'lib/carrelageClient';

export type MapFullSpotMainClipsProps = {
    clips: Clip[];
};

const MapFullSpotMainClips = ({ clips }: MapFullSpotMainClipsProps) => {
    return (
        <ScrollBar maxHeight="100%">
            <div id="map-full-spot-popup-main">
                <div id="map-full-spot-popup-main-clips">
                    {clips.map((clip) => (
                        <div key={clip.id} className="map-full-spot-popup-main-clip">
                            <h3 className="map-full-spot-popup-main-clip-author">{clip.addedBy.username}</h3>
                            <h2 className="map-full-spot-popup-main-clip-title">{clip.title}</h2>
                            <VideoPlayerContainer clip={clip} />
                        </div>
                    ))}
                </div>
            </div>
        </ScrollBar>
    );
};

export default MapFullSpotMainClips;
