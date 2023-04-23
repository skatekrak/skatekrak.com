import {
    useFloating,
    offset,
    useInteractions,
    useHover,
    useFocus,
    useRole,
    useDismiss,
    autoUpdate,
    shift,
} from '@floating-ui/react-dom-interactions';
import React, { cloneElement, useEffect, useState } from 'react';

type TooltipProps = {
    render: (props: any) => React.ReactNode;
    children: JSX.Element;
};

const Tooltip = ({ render, children }: TooltipProps) => {
    const [open, setOpen] = useState(false);

    const { x, y, reference, floating, strategy, context, refs, update } = useFloating({
        placement: 'left-start',
        open,
        onOpenChange: setOpen,
        middleware: [offset(10), shift()],
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        useHover(context),
        useFocus(context),
        useRole(context, { role: 'tooltip' }),
        useDismiss(context),
    ]);

    useEffect(() => {
        if (refs.reference.current && refs.floating.current && open) {
            return autoUpdate(refs.reference.current, refs.floating.current, update);
        }
    }, [refs.reference, refs.floating, open, update]);

    return (
        <>
            {cloneElement(children, getReferenceProps({ ref: reference, ...children.props }))}
            {open &&
                render(
                    getFloatingProps({
                        ref: floating,
                        style: {
                            position: strategy,
                            top: y ?? '',
                            left: x ?? '',
                        },
                    }),
                )}
        </>
    );
};

export default Tooltip;
