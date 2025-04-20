import React from 'react';
import classNames from 'classnames';

export const NavSocialIconLink = ({ className, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    return (
        <a {...props} className={classNames('flex flex-shrink-0 p-1 rounded-full hover:bg-onDark-divider', className)}>
            {children}
        </a>
    );
};

export const NavSocialIconSeparator = ({ className, ...props }: React.AnchorHTMLAttributes<HTMLDivElement>) => {
    return (
        <div {...props} className={classNames('h-4 w-[1px] mx-2 bg-onDark-lowEmphasis rotate-[33deg]', className)} />
    );
};
