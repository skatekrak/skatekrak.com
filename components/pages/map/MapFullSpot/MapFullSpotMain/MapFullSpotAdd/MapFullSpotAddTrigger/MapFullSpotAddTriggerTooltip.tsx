import React, { cloneElement, useState } from 'react';
import {
    useFloating,
    offset,
    useInteractions,
    useRole,
    useDismiss,
    shift,
    useClick,
} from '@floating-ui/react-dom-interactions';

import * as S from './MapFullSpotAddTrigger.styled';

type MapFullSpotAddTriggerTooltipProps = {
    render: (props: any) => React.ReactNode;
    children: JSX.Element;
};

const MapFullSpotAddTriggerTooltip = ({ render, children }: MapFullSpotAddTriggerTooltipProps) => {
    const [open, setOpen] = useState(false);

    const { x, y, reference, floating, strategy, context } = useFloating({
        placement: 'bottom-end',
        open,
        onOpenChange: setOpen,
        middleware: [offset(10), shift()],
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        useClick(context),
        // useFocus(context),
        useDismiss(context),
        useRole(context, { role: 'menu' }),
    ]);

    return (
        <>
            {cloneElement(children, getReferenceProps({ ref: reference, ...children.props }))}
            {open && (
                <S.MapFullSpotAddTriggerTooltipContainer
                    {...getFloatingProps({
                        ref: floating,
                        style: {
                            position: strategy,
                            top: y ?? '',
                            left: x ?? '',
                        },
                    })}
                >
                    {render({
                        close: () => {
                            setOpen(false);
                        },
                    })}
                </S.MapFullSpotAddTriggerTooltipContainer>
            )}
        </>
    );
};

export default MapFullSpotAddTriggerTooltip;
