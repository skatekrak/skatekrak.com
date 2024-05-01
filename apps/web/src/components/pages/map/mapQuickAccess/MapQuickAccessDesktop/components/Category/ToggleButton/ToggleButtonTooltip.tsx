import React, { useCallback } from 'react';

import Typography from '@/components/Ui/typography/Typography';
import IconArrowHead from '@/components/Ui/Icons/ArrowHead';
import Tooltip from '../../Tooltip';
import * as S from './ToggleButton.styled';

type ToggleButtonTooltipProps = {
    text: string;
    children: JSX.Element;
};

const ToggleButtonTooltip = ({ children, text }: ToggleButtonTooltipProps) => {
    const renderTooltip = useCallback(
        (props) => {
            return (
                <S.Tooltip {...props}>
                    <Typography as="h4" component="condensedHeading6">
                        {text}
                    </Typography>
                    <IconArrowHead />
                </S.Tooltip>
            );
        },
        [text],
    );

    return <Tooltip render={renderTooltip}>{children}</Tooltip>;
};

export default ToggleButtonTooltip;
