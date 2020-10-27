import NextLink from 'next/link';
import React from 'react';

import usePathname from 'lib/use-pathname';

const Link = React.memo(NextLink);

type Props = {
    title: string;
    url: string;
    blank?: boolean;
};

const NavItem = ({ title, url, blank }: Props) => {
    const pathname = usePathname();
    let className = 'header-nav-main-item-link';
    className = pathname.startsWith(url) ? `${className} ${className}-active`.trim() : className;

    return (
        <li className="header-nav-main-item">
            {blank ? (
                <a href={url} className={className} target={blank ? '_blank' : undefined}>
                    {title}
                </a>
            ) : (
                <Link href={url}>
                    <a className={className}>{title}</a>
                </Link>
            )}
        </li>
    );
};

export default React.memo(NavItem);
