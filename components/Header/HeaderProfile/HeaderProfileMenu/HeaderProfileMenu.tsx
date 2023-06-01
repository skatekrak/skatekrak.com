import React, { cloneElement, useState } from 'react';
import { offset, shift, useClick, useDismiss, useFloating, useInteractions } from '@floating-ui/react';

import * as S from './HeaderProfileMenu.styled';

type Props = {
    render: (data?: { close: () => void }) => React.ReactNode;
    children: JSX.Element;
};

const HeaderProfileMenu: React.FC<Props> = ({ render, children }) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const { x, y, strategy, context, refs } = useFloating({
        open: isProfileMenuOpen,
        onOpenChange: setIsProfileMenuOpen,
        placement: 'bottom',
        middleware: [shift(), offset({ mainAxis: 10, crossAxis: -16 })],
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([useClick(context), useDismiss(context)]);

    return (
        <>
            {cloneElement(children, getReferenceProps({ ref: refs.setReference, ...children.props }))}
            {isProfileMenuOpen && (
                <S.HeaderProfileMenuContainer
                    {...getFloatingProps({
                        ref: refs.setFloating,
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
