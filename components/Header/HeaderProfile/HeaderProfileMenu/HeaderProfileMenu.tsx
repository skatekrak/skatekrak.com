import React, { cloneElement, useState } from 'react';
import { offset, shift, useClick, useDismiss, useFloating, useInteractions } from '@floating-ui/react-dom-interactions';

import * as S from './HeaderProfileMenu.styled';

type Props = {
    render: (data?: { close: () => void }) => React.ReactNode;
    children: JSX.Element;
};

const HeaderProfileMenu: React.FC<Props> = ({ render, children }) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const { x, y, strategy, reference, floating, context } = useFloating({
        open: isProfileMenuOpen,
        onOpenChange: setIsProfileMenuOpen,
        placement: 'bottom',
        middleware: [shift(), offset({ mainAxis: 10, crossAxis: -16 })],
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([useClick(context), useDismiss(context)]);

    return (
        <>
            {cloneElement(children, getReferenceProps({ ref: reference, ...children.props }))}
            {isProfileMenuOpen && (
                <S.HeaderProfileMenuContainer
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
                            setIsProfileMenuOpen(false);
                        },
                    })}
                </S.HeaderProfileMenuContainer>
            )}
        </>
    );
};

export default React.memo(HeaderProfileMenu);
