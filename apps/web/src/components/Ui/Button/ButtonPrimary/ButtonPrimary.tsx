/*
 * Npm import
 */
import React from 'react';
import classnames from 'classnames';

/*
 * Local import
 */
import { SpinnerCircle } from '@/components/Ui/Icons/Spinners';
import Typography from '@/components/Ui/typography/Typography';

/*
 * Code
 */
type Props = {
    onClick?: (fct: any) => void;
    loading?: boolean;
    loadingWithtext?: boolean;
    className?: string;
    type?: 'reset' | 'submit' | 'button';
    disabled?: boolean;
    icon?: JSX.Element;
    fullWidth?: boolean;
};

const ButtonPrimary: React.FC<Props & { children: React.ReactNode }> = ({
    onClick,
    className,
    children,
    type,
    disabled,
    loading,
    loadingWithtext,
    icon,
    fullWidth,
}) => (
    <button
        className={classnames(
            'button-primary',
            'inline-flex items-center justify-center py-3 px-8 text-onDark-highEmphasis bg-primary-80 rounded transition-all duration-150 hover:bg-primary-100 disabled:text-onDark-lowEmphasis disabled:bg-tertiary-light disabled:hover:bg-tertiary-light [&_.spinner-circle]:h-6 [&_.spinner-circle]:w-6 [&_.spinner-circle]:mr-4 [&_.spinner-circle_.path]:stroke-onDark-highEmphasis disabled:[&_.spinner-circle_.path]:stroke-onDark-lowEmphasis [&_.icon]:-ml-4 [&_.icon]:mr-2',
            { 'w-full': fullWidth },
            className,
        )}
        onClick={onClick}
        type={type}
        disabled={disabled}
    >
        {loading ? (
            <>
                <SpinnerCircle />
                {loadingWithtext && <Typography component="button">{children}</Typography>}
            </>
        ) : (
            <>
                {icon && icon}
                <Typography component="button">{children}</Typography>
            </>
        )}
    </button>
);

/*
 * Export Default
 */
export default ButtonPrimary;
