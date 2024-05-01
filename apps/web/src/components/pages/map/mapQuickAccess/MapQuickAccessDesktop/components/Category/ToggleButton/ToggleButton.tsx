import React, { Ref } from 'react';

import ToggleButtonTooltip from './ToggleButtonTooltip';
import RoundedImage from '../../RoundedImage';
import * as S from './ToggleButton.styled';

type Props = {
    ref?: Ref<HTMLDivElement>;
    isOpen: boolean;
    onClick: () => void;
    selected: boolean;
    src: string;
    tooltipText: string;
};

const ToggleButton: React.FC<Props> = React.forwardRef((props, ref) => {
    const { onClick, isOpen, src, tooltipText, selected } = props;
    return (
        <div ref={ref}>
            <ToggleButtonTooltip text={tooltipText}>
                <S.ToggleButton onClick={onClick} isOpen={isOpen}>
                    <RoundedImage selected={selected} src={src} alt={tooltipText} />
                </S.ToggleButton>
            </ToggleButtonTooltip>
        </div>
    );
});

ToggleButton.displayName = 'ToggleButton';

export default ToggleButton;
