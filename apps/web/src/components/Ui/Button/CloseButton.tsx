import * as React from 'react';

import IconCross from '@/components/Ui/Icons/Cross';
import classNames from 'classnames';

type Props = {
    onClick: (fct: any) => void;
    className?: string;
};

const CloseButton = ({ onClick, className }: Props) => (
    <button
        className={classNames(
            'flex items-center justify-center w-6 h-6 p-1 bg-onDark-placeholder hover:bg-onDark-lowEmphasis rounded-full',
            className,
        )}
        onClick={onClick}
    >
        <IconCross className="fill-onDark-mediumEmphasis" />
    </button>
);

export default CloseButton;
