import { useRouter } from 'next/router';
import React from 'react';

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
            <ActiveLink href={url} className="header-nav-main-item-link" activeClassName="active">
                {title}
            </ActiveLink>
        )}
    </li>
);

const ActiveLink = ({ children, activeClassName, href, ...props }) => {
    const { pathname } = useRouter();
    const className = pathname.startsWith(href)
        ? `${props.className} ${props.className}-${activeClassName}`.trim()
        : props.className;

    return (
        <a className={className} href={href}>
            {children}
        </a>
    );
};

export default NavItem;
