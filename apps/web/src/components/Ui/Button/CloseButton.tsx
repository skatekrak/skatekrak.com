/*
 * Npm import
 */
import * as React from 'react';

/*
 * Local import
 */
import IconCross from '@/components/Ui/Icons/Cross';

/*
 * Code
 */
type Props = {
    onClick: (fct: any) => void;
};

const CloseButton: React.FC<Props> = ({ onClick }) => (
    <button className="krak-close-button" onClick={onClick}>
        <IconCross />
    </button>
);

/*
 * Export Default
 */
export default CloseButton;
