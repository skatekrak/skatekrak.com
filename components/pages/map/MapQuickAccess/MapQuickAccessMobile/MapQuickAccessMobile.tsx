import React, { useState } from 'react';
import Tippy from '@tippyjs/react';

import Typography from 'components/Ui/typography/Typography';
import MapQuickAccessMobileCities from './MapQuickAccessMobileCities';
import * as S from './MapQuickAccessMobile.styled';

type Props = {
    container: Element | undefined;
};

const MapQuickAccessMobile: React.FC<Props> = ({ container }) => {
    const [isCitiesOpen, setIsCitiesOpen] = useState(false);

    const onCitiesClick = (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsCitiesOpen(!isCitiesOpen);
    };

    console.log(isCitiesOpen);

    return (
        <S.MapQuickAccessMobileContainer>
            <div>
                <Tippy
                    visible={isCitiesOpen}
                    onClickOutside={() => setIsCitiesOpen(false)}
                    interactive
                    // triggerTarget={container}
                    placement="top"
                    render={() => <MapQuickAccessMobileCities isOpen={isCitiesOpen} onCitiesClick={onCitiesClick} />}
                >
                    <S.MapQuickAccessMobileTrigger onClick={onCitiesClick}>
                        <Typography component="condensedButton">Cities</Typography>
                    </S.MapQuickAccessMobileTrigger>
                </Tippy>
            </div>
            <S.MapQuickAccessMobileTrigger>
                <Typography component="condensedButton">Maps</Typography>
            </S.MapQuickAccessMobileTrigger>
        </S.MapQuickAccessMobileContainer>
    );
};

export default React.memo(MapQuickAccessMobile);
