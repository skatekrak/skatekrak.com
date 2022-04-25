import React, { cloneElement, useState } from 'react';
import { useFloating, useInteractions, useDismiss, useClick } from '@floating-ui/react-dom-interactions';

import Scrollbar from 'components/Ui/Scrollbar';
import * as S from './MapCustomNavigationExtension.styled';

type Props = {
    maxWidth?: string;
    render: (data?: { close: () => void }) => React.ReactNode;
    children: JSX.Element;
};

const MapCustomNavigationExtension: React.FC<Props> = ({ maxWidth, render, children }) => {
    const [isExtensionOpen, setIsExtensionOpen] = useState(false);

    const { y, strategy, reference, floating, context } = useFloating({
        open: isExtensionOpen,
        onOpenChange: setIsExtensionOpen,
        placement: 'bottom',
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([useClick(context), useDismiss(context)]);

    return (
        <>
            {cloneElement(children, getReferenceProps({ ref: reference, isOpen: isExtensionOpen, ...children.props }))}
            {isExtensionOpen && (
                <S.MapCustomNavigationExtensionContainer
                    {...getFloatingProps({
                        ref: floating,
                        style: { maxWidth: maxWidth, position: strategy, top: y ?? '', left: '0' },
                    })}
                >
                    <Scrollbar maxHeight="60vh">
                        {render({
                            close: () => {
                                setIsExtensionOpen(false);
                            },
                        })}
                    </Scrollbar>
                </S.MapCustomNavigationExtensionContainer>
            )}
        </>
    );
};

export default MapCustomNavigationExtension;
