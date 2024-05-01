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
} from '@floating-ui/react';
import React, { useEffect, useState } from 'react';

type TooltipProps = {
    render: (props: any) => React.ReactNode;
    children: JSX.Element;
};

const Tooltip = ({ render, children }: TooltipProps) => {
    const [open, setOpen] = useState(false);

    const { context, refs, update, floatingStyles } = useFloating({
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
            <div ref={refs.setReference} {...getReferenceProps()}>
                {children}
            </div>

            {open && (
                <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
                    {render(getFloatingProps())}
                </div>
            )}
        </>
    );
};

export default Tooltip;
