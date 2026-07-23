import React from 'react';

import Typography from '@/components/Ui/typography/Typography';

const MapSearchResultNoContent = () => {
    return (
        <div className="px-8 py-4 text-center [&_.ui-Typography:last-child]:mt-1 [&_.ui-Typography:last-child]:text-onDark-mediumEmphasis">
            <Typography component="body1">We can't find this spot or map in our system</Typography>
            <Typography component="body2">You can create new spots with the “+” button</Typography>
        </div>
    );
};

export default MapSearchResultNoContent;
