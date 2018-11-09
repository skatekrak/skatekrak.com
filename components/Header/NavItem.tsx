import * as React from 'react';
import Link from '../Link';

type Props = {
    title: string;
    url: string;
    blank?: boolean;
};

const NavItem: React.SFC<Props> = ({ title, url, blank }: Props) => (
    <li className="header-nav-main-item">
        {blank ? (
            <a href={url} className="header-nav-main-item-link" target={blank ? '_blank' : undefined}>
                {title}
            </a>
        ) : (
            <Link href={url} activeClassName="active">
                <a className="header-nav-main-item-link">{title}</a>
            </Link>
        )}
    </li>
);

export default NavItem;
