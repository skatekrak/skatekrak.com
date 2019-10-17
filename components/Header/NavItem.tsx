import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

type Props = {
    title: string;
    url: string;
    blank?: boolean;
};

const NavItem = ({ title, url, blank }: Props) => {
    const { pathname } = useRouter();
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

export default NavItem;
