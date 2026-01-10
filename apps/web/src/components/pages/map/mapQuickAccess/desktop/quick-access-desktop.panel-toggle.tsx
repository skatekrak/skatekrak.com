import React, { Ref, useState } from 'react';
import {
    useFloating,
    offset,
    useInteractions,
    useHover,
    useFocus,
    useRole,
    useDismiss,
    shift,
} from '@floating-ui/react';

import RoundedImage from '../RoundedImage';
import Typography from '@/components/Ui/typography/Typography';
import IconArrowHead from '@/components/Ui/Icons/ArrowHead';

type Props = {
    ref?: Ref<HTMLDivElement>;
    onClick: () => void;
    selected: boolean;
    src: string;
    tooltipText: string;
};

const QuickAccessDesktopPanelToggle: React.FC<Props> = React.forwardRef(
    ({ onClick, src, tooltipText, selected }, ref) => {
        const [open, setOpen] = useState(false);

        const { context, refs, floatingStyles } = useFloating({
            placement: 'left',
            open,
            onOpenChange: setOpen,
            middleware: [offset({ mainAxis: 8, crossAxis: 0 }), shift()],
        });

        const { getReferenceProps, getFloatingProps } = useInteractions([
            useHover(context),
            useFocus(context),
            useRole(context, { role: 'tooltip' }),
            useDismiss(context),
        ]);

        return (
            <div ref={ref}>
                <button
                    {...getReferenceProps({
                        ref: refs.setReference,
                        onClick,
                        className: 'relative flex py-1.5 px-3 text-onDark-highEmphasis cursor-pointer',
                    })}
                >
                    <RoundedImage selected={selected} src={src} alt={tooltipText} />
                </button>

                {open && (
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                        className="flex items-center justify-between py-3 px-2 pl-4 text-right text-onDark-highEmphasis bg-tertiary-dark border border-solid border-tertiary-medium rounded shadow-onDarkHighSharp cursor-pointer z-[9999999999]"
                    >
                        <Typography as="h4" component="condensedHeading6">
                            {tooltipText}
                        </Typography>
                        <IconArrowHead className="w-5 ml-2 mt-0.5 fill-onDark-highEmphasis" />
                    </div>
                )}
            </div>
        );
    },
);

QuickAccessDesktopPanelToggle.displayName = 'QuickAccessDesktopPanelToggle';

export default QuickAccessDesktopPanelToggle;
