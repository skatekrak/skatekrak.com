import {
    useFloating,
    offset,
    useInteractions,
    useHover,
    useFocus,
    useRole,
    useDismiss,
    shift,
    FloatingPortal,
} from '@floating-ui/react';
import classNames from 'classnames';
import NextImage from 'next/image';
import React, { Ref, useState } from 'react';

import { KrakImage } from '@krak/ui';

import IconArrowHead from '@/components/Ui/Icons/ArrowHead';
import Typography from '@/components/Ui/typography/Typography';

type Props = {
    ref?: Ref<HTMLDivElement>;
    onClick: () => void;
    selected: boolean;
    isPanelOpen: boolean;
    src?: string;
    imagePath?: string;
    tooltipText: string;
};

const QuickAccessDesktopPanelToggle: React.FC<Props> = React.forwardRef(
    ({ onClick, src, imagePath, tooltipText, selected, isPanelOpen }, ref) => {
        const [isHover, setIsHover] = useState(false);

        const { context, refs, floatingStyles } = useFloating({
            placement: 'left',
            open: isHover,
            onOpenChange: setIsHover,
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
                    <div
                        className={classNames('relative size-11', {
                            'after:absolute after:inset-y-0 after:-left-3 after:block after:w-0.5':
                                selected || isPanelOpen,
                            'after:bg-white/30': isPanelOpen && !selected,
                            'after:bg-primary-80': selected,
                        })}
                    >
                        {imagePath != null ? (
                            <KrakImage
                                path={imagePath}
                                options={{ width: 44, height: 44, resizingType: 'fill' }}
                                alt={tooltipText}
                                className="block size-11 bg-tertiary-medium border border-solid border-tertiary-light rounded-full"
                            />
                        ) : (
                            <NextImage
                                fill
                                src={src ?? ''}
                                alt={tooltipText}
                                className="block bg-tertiary-medium border border-solid border-tertiary-light rounded-full"
                            />
                        )}
                    </div>
                </button>

                {isHover && (
                    <FloatingPortal>
                        <div
                            ref={refs.setFloating}
                            style={floatingStyles}
                            {...getFloatingProps()}
                            className="z-1 flex items-center justify-between py-1 px-2 pl-4 text-right text-onDark-highEmphasis bg-tertiary-dark border border-solid border-tertiary-medium rounded shadow-onDarkHighSharp cursor-pointer"
                        >
                            <Typography as="h4" component="condensedHeading6">
                                {tooltipText}
                            </Typography>
                            <IconArrowHead className="w-5 ml-2 mt-0.5 fill-onDark-highEmphasis" />
                        </div>
                    </FloatingPortal>
                )}
            </div>
        );
    },
);

QuickAccessDesktopPanelToggle.displayName = 'QuickAccessDesktopPanelToggle';

export default QuickAccessDesktopPanelToggle;
