import React, { useState } from 'react';
import { useFloating, useInteractions, useClick, useDismiss, offset, shift } from '@floating-ui/react';

import ToggleButton from './quick-access-desktop.panel-toggle';
import ScrollBar from '@/components/Ui/Scrollbar';

type Props = {
    isSelected: boolean;
    src: string;
    tooltipText: string;
    panelContent: (closePanel: () => void) => React.ReactElement;
};

const QuickAccessDesktopPanel = ({ isSelected, src, tooltipText, panelContent }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const { refs, context, floatingStyles } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: 'left-start',
        middleware: [offset({ mainAxis: 8, crossAxis: -10 }), shift()],
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([useClick(context), useDismiss(context)]);

    return (
        <>
            <ToggleButton
                {...getReferenceProps({ ref: refs.setReference })}
                onClick={() => setIsOpen(!isOpen)}
                selected={isSelected}
                src={src}
                tooltipText={tooltipText}
            />
            {isOpen && (
                <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                    {...getFloatingProps()}
                    className="w-[23rem] text-onLight-highEmphasis bg-tertiary-dark border border-solid border-tertiary-medium rounded shadow shadow-onLight-placeholder"
                >
                    <ScrollBar maxHeight="calc(100vh - 7rem)">{panelContent(() => setIsOpen(false))}</ScrollBar>
                </div>
            )}
        </>
    );
};

export default QuickAccessDesktopPanel;
