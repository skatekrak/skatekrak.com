import React from 'react';

import Typography from '@/components/Ui/typography/Typography';

const MapSearchResultNoContent = () => {
    return (
        <div className="px-8 py-4 text-center [&_.ui-Typography:last-child]:mt-1 [&_.ui-Typography:last-child]:text-onDark-mediumEmphasis">
            <Typography component="body1">We can't find this spot in our system</Typography>
            <Typography component="body2">Download the app to create new spots and add media.</Typography>
        </div>
    );
};

export default MapSearchResultNoContent;
