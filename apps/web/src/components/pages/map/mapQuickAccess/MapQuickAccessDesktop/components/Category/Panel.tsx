import React from 'react';

import ScrollBar from '@/components/Ui/Scrollbar';
import classNames from 'classnames';

type PanelProps = {
    isOpen: boolean;
    children: JSX.Element;
};

/** Wrapper to set styles and scroll height on categories */
const Panel: React.FC<PanelProps> = ({ isOpen, children }) => {
    return (
        <div
            className={classNames(
                'hidden w-[23rem] text-onLight-highEmphasis bg-tertiary-dark border border-solid border-tertiary-medium rounded shadow shadow-onLight-placeholder',
                { '!block': isOpen },
            )}
        >
            <ScrollBar maxHeight="calc(100vh - 7rem)">{children}</ScrollBar>
        </div>
    );
};

export default Panel;
