import React from 'react';
import styled from 'styled-components';

import { truncateMultipleLinesStyles, truncateOneLineStyles, TruncateTextProps } from './truncateText';

type TypographyProps = {
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'strong';
    component?:
        | 'heading1'
        | 'heading2'
        | 'heading3'
        | 'heading4'
        | 'heading5'
        | 'heading6'
        | 'subtitle1'
        | 'subtitle2'
        | 'body1'
        | 'body2'
        | 'button'
        | 'caption'
        | 'overline'
        | 'condensedHeading3'
        | 'condensedHeading4'
        | 'condensedHeading5'
        | 'condensedHeading6'
        | 'condensedSubtitle1'
        | 'condensedBody1'
        | 'condensedButton'
        | 'condensedOverline';
};

const StyledTypography = styled.p<TruncateTextProps & TypographyProps>`
    position: relative;
    font-family: ${({ theme }) => theme.typography.fonts.roboto.regular};
    line-height: 1.33;

    & * {
        display: inline !important;
    }

    ${({ component, theme }) =>
        (component === 'heading1' && {
            fontFamily: theme.typography.fonts.roboto.bold,
            fontSize: '6rem',
            lineHeight: '7rem',
            letterSpacing: '-0.09375rem',
        }) ||
        (component === 'heading2' && {
            fontFamily: theme.typography.fonts.roboto.bold,
            fontSize: '3.75rem',
            lineHeight: '4.5rem',
            letterSpacing: '-0.03125rem',
        }) ||
        (component === 'heading3' && {
            fontFamily: theme.typography.fonts.roboto.regular,
            fontSize: '3rem',
        }) ||
        (component === 'heading4' && {
            fontFamily: theme.typography.fonts.roboto.bold,
            fontSize: '2.125rem',
            letterSpacing: '0.015625rem',
        }) ||
        (component === 'heading5' && {
            fontFamily: theme.typography.fonts.roboto.bold,
            fontSize: '1.5rem',
            lineHeight: '1.8125rem',
        }) ||
        (component === 'heading6' && {
            fontFamily: theme.typography.fonts.roboto.bold,
            fontSize: '1.25rem',
            lineHeight: '1.5rem',
            letterSpacing: '0.015625rem',
        }) ||
        (component === 'subtitle1' && {
            fontFamily: theme.typography.fonts.roboto.bold,
            fontSize: '1rem',
            letterSpacing: '-0.03125rem',
        }) ||
        (component === 'subtitle2' && {
            fontFamily: theme.typography.fonts.roboto.bold,
            fontSize: '0.875rem',
        }) ||
        (component === 'body1' && {
            fontFamily: theme.typography.fonts.roboto.regular,
            fontSize: '1rem',
        }) ||
        (component === 'body2' && {
            fontFamily: theme.typography.fonts.roboto.regular,
            fontSize: '0.875rem',
        }) ||
        (component === 'button' && {
            fontFamily: theme.typography.fonts.roboto.bold,
            fontSize: '0.875rem',
            lineHeight: '1.5rem',
            letterSpacing: '0.03125rem',
            textTransform: 'uppercase',
        }) ||
        (component === 'caption' && {
            fontFamily: theme.typography.fonts.roboto.bold,
            fontSize: '0.75rem',
            lineHeight: '1rem',
            letterSpacing: '0.03125rem',
        }) ||
        (component === 'overline' && {
            fontFamily: theme.typography.fonts.roboto.regular,
            fontSize: '0.625rem',
            lineHeight: '1rem',
            letterSpacing: '0.09375rem',
            textTransform: 'uppercase',
        }) ||
        (component === 'condensedHeading3' && {
            fontFamily: theme.typography.fonts.roboto.condensed.bold,
            fontSize: '3rem',
        }) ||
        (component === 'condensedHeading4' && {
            fontFamily: theme.typography.fonts.roboto.condensed.bold,
            fontSize: '2.125rem',
            letterSpacing: '0.015625rem',
        }) ||
        (component === 'condensedHeading5' && {
            fontFamily: theme.typography.fonts.roboto.condensed.bold,
            fontSize: '1.5rem',
            lineHeight: '1.8125rem',
        }) ||
        (component === 'condensedHeading6' && {
            fontFamily: theme.typography.fonts.roboto.condensed.bold,
            fontSize: '1.25rem',
            lineHeight: '1.5rem',
        }) ||
        (component === 'condensedSubtitle1' && {
            fontFamily: theme.typography.fonts.roboto.condensed.bold,
            fontSize: '1rem',
        }) ||
        (component === 'condensedBody1' && {
            fontFamily: theme.typography.fonts.roboto.condensed.regular,
            fontSize: '1rem',
        }) ||
        (component === 'condensedButton' && {
            fontFamily: theme.typography.fonts.roboto.condensed.bold,
            fontSize: '0.875rem',
            letterSpacing: '4%',
            textTransform: 'uppercase',
        }) ||
        (component === 'condensedOverline' && {
            fontFamily: theme.typography.fonts.roboto.condensed.regular,
            fontSize: '0.625rem',
            lineHeight: '1rem',
            letterSpacing: '0.09375rem',
            textTransform: 'uppercase',
        })}

    ${({ truncateLines }) => (truncateLines === 1 ? truncateOneLineStyles : truncateMultipleLinesStyles(truncateLines))}
`;

const Typography: React.FC<TruncateTextProps & TypographyProps> = ({
    className,
    truncateLines,
    as,
    component,
    children,
}) => (
    <StyledTypography
        as={as}
        truncateLines={truncateLines}
        component={component !== undefined ? component : 'body1'}
        className={`ui-Typography ${className}`}
    >
        {children}
    </StyledTypography>
);

export default Typography;
