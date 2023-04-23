import React, { cloneElement, useState } from 'react';
import { useFloating, useInteractions, useDismiss, useClick } from '@floating-ui/react-dom-interactions';

import Scrollbar from 'components/Ui/Scrollbar';
import CloseButton from 'components/Ui/Button/CloseButton';
import * as S from './MapBottomNavSheet.styled';

type Props = {
    title?: string;
    maxWidth?: string;
    render: (data?: { close: () => void }) => React.ReactNode;
    children: JSX.Element;
    displayCloseButton?: boolean;
};

const MapBottomNavSheet: React.FC<Props> = ({ title, maxWidth, render, children, displayCloseButton = true }) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const { reference, floating, context } = useFloating({
        open: isSheetOpen,
        onOpenChange: setIsSheetOpen,
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([useClick(context), useDismiss(context)]);

    return (
        <>
            {cloneElement(children, getReferenceProps({ ref: reference, ...children.props }))}
            {isSheetOpen && (
                <S.MapBottomNavSheetContainer {...getFloatingProps({ ref: floating, style: { maxWidth: maxWidth } })}>
                    {displayCloseButton && <CloseButton onClick={() => setIsSheetOpen(false)} />}
                    {title && (
                        <S.MapBottomNavSheetTitle component="condensedHeading6">{title}</S.MapBottomNavSheetTitle>
                    )}
                    <Scrollbar maxHeight="60vh">
                        {render({
                            close: () => {
                                setIsSheetOpen(false);
                            },
                        })}
                    </Scrollbar>
                </S.MapBottomNavSheetContainer>
            )}
        </>
    );
};

export default MapBottomNavSheet;
