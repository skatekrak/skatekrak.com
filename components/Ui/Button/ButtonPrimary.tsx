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
    loadingContent?: string;
    loading?: boolean;
    className?: string;
    type?: 'reset' | 'submit' | 'button';
    disabled?: boolean;
};

const ButtonPrimary: React.SFC<Props> = ({ onClick, className, children, type, disabled, loading, loadingContent }) => (
    <button className={`button-primary ${className}`} onClick={onClick} type={type} disabled={disabled}>
        {loading && <SpinnerCircle />}
        {loading && (loadingContent ? loadingContent : children)}
        {!loading && children}
    </button>
);

/*
 * Export Default
 */
export default ButtonPrimary;
