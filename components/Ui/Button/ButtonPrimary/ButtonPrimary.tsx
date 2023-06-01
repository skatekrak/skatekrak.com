/*
 * Npm import
 */
import React from 'react';

/*
 * Local import
 */
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import * as S from './ButtonPrimary.styled';
import Typography from 'components/Ui/typography/Typography';

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
    <S.ButtonPrimaryContainer
        className={`button-primary ${className}`}
        onClick={onClick}
        type={type}
        disabled={disabled}
        fullWidth={fullWidth}
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
    </S.ButtonPrimaryContainer>
);

/*
 * Export Default
 */
export default ButtonPrimary;
