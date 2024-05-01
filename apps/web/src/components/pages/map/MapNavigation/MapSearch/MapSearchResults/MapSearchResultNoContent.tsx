import React from 'react';

import Typography from '@/components/Ui/typography/Typography';
import * as S from './MapSearchResults.styled';

const MapSearchResultNoContent = () => {
    return (
        <S.MapSearchResultsNoContent>
            <Typography component="body1">We can’t find this spot in our system</Typography>
            <Typography component="body2">Download the app to create new spots and add media.</Typography>
        </S.MapSearchResultsNoContent>
    );
};

export default MapSearchResultNoContent;
