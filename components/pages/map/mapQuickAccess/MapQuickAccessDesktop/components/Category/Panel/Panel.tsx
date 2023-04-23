import React from 'react';

import ScrollBar from 'components/Ui/Scrollbar';
import * as S from './Panel.styled';

type PanelProps = {
    isOpen: boolean;
    children: JSX.Element;
};

/** Wrapper to set styles and scroll height on categories */
const Panel: React.FC<PanelProps> = ({ isOpen, children }) => {
    return (
        <S.Panel isOpen={isOpen}>
            <ScrollBar maxHeight="calc(100vh - 7rem)">{children}</ScrollBar>
        </S.Panel>
    );
};

export default Panel;
