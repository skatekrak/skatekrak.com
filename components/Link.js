import { withRouter } from 'next/router';
import Link from 'next/link';
import React, { Children } from 'react';

const ActiveLink = ({ router, children, href, ...props }) => {
    const child = Children.only(children);

    let className = child.props.className || '';
    if (router.pathname.startsWith(props.href) && props.activeClassName) {
        className = `${className} ${className}-${props.activeClassName}`.trim();
    }

    delete props.activeClassName;

    console.log(href);

    return (
        <Link href={`${href}${encodeQueryData(router.query)}`} {...props}>
            {React.cloneElement(child, { className })}
        </Link>
    );
};

function encodeQueryData(data) {
    const ret = [];
    for (let d in data) ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    let str = '';
    if (ret.length > 0) {
        const join = ret.join('&');
        str = `?${join}`;
    }
    return str;
}

export default withRouter(ActiveLink);
