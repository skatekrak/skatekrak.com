import classNames from 'classnames';
import React from 'react';

type Props = {
    children: React.ReactNode;
    className?: string;
};

const MapLeftPanel = ({ children, className }: Props) => {
    return (
        <div
            className={classNames(
                'absolute inset-y-0 left-0 w-[32rem] bg-tertiary-dark border-r border-solid border-tertiary-medium shadow-2xl z-[1010]',
                className,
            )}
        >
            {children}
        </div>
    );
};

export default MapLeftPanel;
