import React, { cloneElement, useState } from 'react';
import { useFloating, useInteractions, useDismiss, useClick } from '@floating-ui/react';

import Typography from '@/components/Ui/typography/Typography';
import Scrollbar from '@/components/Ui/Scrollbar';
import CloseButton from '@/components/Ui/Button/CloseButton';

type Props = {
    title?: string;
    maxWidth?: string;
    render: (data: { close: () => void }) => React.ReactNode;
    children: JSX.Element;
    displayCloseButton?: boolean;
};

const MapBottomNavSheet: React.FC<Props> = ({ title, maxWidth, render, children, displayCloseButton = true }) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const { refs, context } = useFloating({
        open: isSheetOpen,
        onOpenChange: setIsSheetOpen,
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([useClick(context), useDismiss(context)]);

    return (
        <>
            {cloneElement(children, getReferenceProps({ ref: refs.setReference, ...children.props }))}
            {isSheetOpen && (
                <div
                    {...getFloatingProps({
                        ref: refs.setFloating,
                        style: { maxWidth: maxWidth },
                        className:
                            'absolute block bottom-0 left-0 min-h-[20vh] w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)] text-onDark-highEmphasis bg-tertiary-dark border border-solid border-tertiary-medium rounded shadow-[0px_0px_4px_1px_rgba(0,0,0,0.2)] z-[1000]',
                    })}
                >
                    {displayCloseButton && (
                        <CloseButton className="absolute top-4 right-4 z-[1]" onClick={() => setIsSheetOpen(false)} />
                    )}
                    {title && (
                        <Typography component="condensedHeading6" className="my-4 mx-6 uppercase">
                            {title}
                        </Typography>
                    )}
                    <Scrollbar maxHeight="60vh">
                        {render({
                            close: () => {
                                setIsSheetOpen(false);
                            },
                        })}
                    </Scrollbar>
                </div>
            )}
        </>
    );
};

export default MapBottomNavSheet;
