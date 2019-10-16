import ActiveLink from 'components/Link';
import React from 'react';

// import Link from 'components/Link';

type Props = {
    title: string;
    url: string;
    blank?: boolean;
};

const NavItem = ({ title, url, blank }: Props) => (
    <li className="header-nav-main-item">
        {blank ? (
            <a href={url} className="header-nav-main-item-link" target={blank ? '_blank' : undefined}>
                {title}
            </a>
        ) : (
            <ActiveLink href={url} activeClassName="active">
                <a className="header-nav-main-item-link">{title}</a>
            </ActiveLink>
        )}
    </li>
);

export default NavItem;
