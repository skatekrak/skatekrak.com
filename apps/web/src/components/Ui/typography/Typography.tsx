import React from 'react';
import classnames from 'classnames';

import { getTruncateClasses, TruncateTextProps } from './truncateText';

type Component =
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

/**
 * Tailwind class lookup for each typography variant.
 *
 * Base styles applied to all variants: `relative font-roboto leading-[1.33] [&>*]:!inline`
 * Each variant overrides font-family, font-size, and optionally line-height, letter-spacing, text-transform.
 */
const variantClasses: Record<Component, string> = {
    heading1: 'font-roboto-bold text-[6rem] leading-[7rem] tracking-[-0.09375rem]',
    heading2: 'font-roboto-bold text-[3.75rem] leading-[4.5rem] tracking-[-0.03125rem]',
    heading3: 'font-roboto text-[3rem]',
    heading4: 'font-roboto-bold text-[2.125rem] tracking-[0.015625rem]',
    heading5: 'font-roboto-bold text-[1.5rem] leading-[1.8125rem]',
    heading6: 'font-roboto-bold text-[1.25rem] leading-[1.5rem] tracking-[0.015625rem]',
    subtitle1: 'font-roboto-bold text-[1rem] tracking-[-0.03125rem]',
    subtitle2: 'font-roboto-bold text-[0.875rem]',
    body1: 'font-roboto text-[1rem]',
    body2: 'font-roboto text-[0.875rem]',
    button: 'font-roboto-bold text-[0.875rem] leading-[1.5rem] tracking-[0.03125rem] uppercase',
    caption: 'font-roboto-bold text-[0.75rem] leading-[1rem] tracking-[0.03125rem]',
    overline: 'font-roboto text-[0.625rem] leading-[1rem] tracking-[0.09375rem] uppercase',
    condensedHeading3: 'font-roboto-condensed-bold text-[3rem]',
    condensedHeading4: 'font-roboto-condensed-bold text-[2.125rem] tracking-[0.015625rem]',
    condensedHeading5: 'font-roboto-condensed-bold text-[1.5rem] leading-[1.8125rem]',
    condensedHeading6: 'font-roboto-condensed-bold text-[1.25rem] leading-[1.5rem]',
    condensedSubtitle1: 'font-roboto-condensed-bold text-[1rem]',
    condensedBody1: 'font-roboto-condensed text-[1rem]',
    condensedButton: 'font-roboto-condensed-bold text-[0.875rem] tracking-[4%] uppercase',
    condensedOverline: 'font-roboto-condensed text-[0.625rem] leading-[1rem] tracking-[0.09375rem] uppercase',
};

type HtmlTag = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'strong';

type TypographyProps = {
    className?: string;
    as?: HtmlTag;
    component?: Component;
    title?: string;
};

const Typography: React.FC<TruncateTextProps & TypographyProps & { children: React.ReactNode }> = ({
    className,
    truncateLines,
    as = 'p',
    component = 'body1',
    title,
    children,
}) => {
    return React.createElement(
        as,
        {
            title,
            className: classnames(
                'ui-Typography relative leading-[1.33] [&>*]:!inline',
                variantClasses[component],
                getTruncateClasses(truncateLines),
                className,
            ),
        },
        children,
    );
};

export default Typography;
