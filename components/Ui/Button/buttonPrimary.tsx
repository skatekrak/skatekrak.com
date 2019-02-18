/*
 * Npm import
 */
import React from 'react';

/*
 * Local import
 */
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';

/*
 * Code
 */
type Props = {
    onClick?: (fct: any) => void;
    content: string;
    loadingContent?: string;
    loading?: boolean;
    className?: string;
    type?: string;
    disabled?: boolean;
};

const buttonPrimary: React.SFC<Props> = ({ onClick, className, content, type, disabled, loading, loadingContent }) => (
    <button className={`button-primary ${className}`} onClick={onClick} type={type} disabled={disabled}>
        {loading && <SpinnerCircle />}
        {!loading ? content : loadingContent}
    </button>
);

/*
 * Export Default
 */
export default buttonPrimary;
