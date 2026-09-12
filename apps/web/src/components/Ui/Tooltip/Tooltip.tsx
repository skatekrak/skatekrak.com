import {
    autoUpdate,
    FloatingPortal,
    offset,
    shift,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useMergeRefs,
    useRole,
    type Placement,
} from '@floating-ui/react';
import React, { cloneElement, useState } from 'react';

import { cn } from '@krak/ui';

import IconArrowHead from '@/components/Ui/Icons/ArrowHead';
import Typography from '@/components/Ui/typography/Typography';

type Side = 'top' | 'right' | 'bottom' | 'left';

type TooltipProps = {
    tooltipText: string;
    children: React.ReactElement<{ ref?: React.Ref<HTMLElement> }>;
    placement?: Placement;
    className?: string;
};

const arrowRotation: Record<Side, string> = {
    left: '',
    right: 'rotate-180',
    top: 'rotate-90',
    bottom: '-rotate-90',
};

const layoutClass: Record<Side, string> = {
    left: 'flex-row pl-4',
    right: 'flex-row-reverse pr-4',
    top: 'flex-col pt-2 px-4',
    bottom: 'flex-col-reverse pb-2 px-4',
};

const Tooltip = ({ tooltipText, children, placement = 'left', className }: TooltipProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const {
        context,
        refs,
        floatingStyles,
        placement: actualPlacement,
    } = useFloating({
        placement,
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [offset({ mainAxis: 8, crossAxis: 0 }), shift()],
        whileElementsMounted: autoUpdate,
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        useHover(context),
        useFocus(context),
        useRole(context, { role: 'tooltip' }),
        useDismiss(context),
    ]);

    const { ref: childRef, ...childProps } = children.props;
    const ref = useMergeRefs([refs.setReference, childRef]);
    const side = actualPlacement.split('-')[0] as Side;

    return (
        <>
            {cloneElement(children, getReferenceProps({ ...childProps, ref }))}
            {isOpen && (
                <FloatingPortal>
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                        className={cn(
                            'z-1100 flex items-center gap-2 py-1 px-2 text-onDark-highEmphasis bg-tertiary-dark border border-solid border-tertiary-medium rounded shadow-onDarkHighSharp',
                            layoutClass[side],
                            className,
                        )}
                    >
                        <Typography as="h4" component="condensedHeading6">
                            {tooltipText}
                        </Typography>
                        <IconArrowHead className={cn('w-5 fill-onDark-highEmphasis', arrowRotation[side])} />
                    </div>
                </FloatingPortal>
            )}
        </>
    );
};

export default Tooltip;
