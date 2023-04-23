import React, { Ref } from 'react';

import ToggleButtonTooltip from './ToggleButtonTooltip';
import RoundedImage from '../../RoundedImage';
import * as S from './ToggleButton.styled';

type Props = {
    ref?: Ref<HTMLDivElement>;
    isOpen: boolean;
    onClick: () => void;
    selected: boolean;
    faded: boolean;
    src: string;
    srcSet: string;
    tooltipText: string;
};

const ToggleButton: React.FC<Props> = React.forwardRef((props, ref) => {
    const { onClick, isOpen, src, srcSet, tooltipText, selected, faded } = props;
    return (
        <div ref={ref}>
            <ToggleButtonTooltip text={tooltipText}>
                <S.ToggleButton onClick={onClick} isOpen={isOpen}>
                    <RoundedImage selected={selected} faded={faded} src={src} srcSet={srcSet} alt={tooltipText} />
                </S.ToggleButton>
            </ToggleButtonTooltip>
        </div>
    );
});

ToggleButton.displayName = 'ToggleButton';

export default ToggleButton;
