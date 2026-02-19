import React from 'react';

import Emoji from '@/components/Ui/Icons/Emoji';
import Typography from '@/components/Ui/typography/Typography';

const MapZoomAlert = () => {
    return (
        <div className="absolute top-40 left-6 right-6 flex flex-col p-4 bg-tertiary-dark border border-tertiary-medium rounded shadow-onDarkHighSharp pointer-events-none mobile:w-[21rem] mobile:bottom-[15vh] mobile:left-[calc(50%-10.5rem)] mobile:top-auto mobile:right-auto laptop-s:bottom-[10vh]">
            <div className="absolute -top-3 left-4 z-10 [&_span]:text-[1.375rem]">
                <Emoji symbol="⚠️" label="warning" />
                &emsp;
                <Emoji symbol="📡" label="antenna" />
            </div>
            <Typography component="body1" className="italic text-onDark-mediumEmphasis">
                "Ground Control to Major Tom, come back to earth ..."
            </Typography>
            <Typography component="body1" className="mt-2 text-map-private-default">
                Zoom in to display spots
            </Typography>
        </div>
    );
};

export default MapZoomAlert;
