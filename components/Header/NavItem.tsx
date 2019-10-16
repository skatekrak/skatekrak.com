import Link from 'next/link';
import React from 'react';

// import Link from 'components/Link';

type Props = {
    title: string;
    url: string;
    blank?: boolean;
    as?: string;
};

const NavItem = ({ title, url, blank, as }: Props) => (
    <li className="header-nav-main-item">
        {blank ? (
            <a href={url} className="header-nav-main-item-link" target={blank ? '_blank' : undefined}>
                {title}
            </a>
        ) : (
            <Link href={url} as={as}>
                <a className="header-nav-main-item-link">{title}</a>
            </Link>
        )}
    </li>
);

export default NavItem;
