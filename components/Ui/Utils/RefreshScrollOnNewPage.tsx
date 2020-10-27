import { Router, withRouter } from 'next/router';
import React from 'react';

import ScrollHelper from 'lib/ScrollHelper';

type Props = {
    router: Router;
};

class RefreshScrollOnNewPage extends React.Component<Props> {
    public componentDidUpdate(prevProps: Readonly<Props>) {
        if (this.props.router.asPath !== prevProps.router.asPath) {
            ScrollHelper.getScrollContainer().scrollTop = 0;
        }
    }

    public render() {
        return this.props.children;
    }
}

export default withRouter(RefreshScrollOnNewPage);
