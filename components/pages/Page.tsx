import analytics from '@thepunkclub/analytics';
import React from 'react';

import 'static/styles/checkout.styl';
import 'static/styles/club.styl';
import 'static/styles/news.styl';

import 'static/styles/checkbox.styl';
import 'static/styles/icons.styl';
import 'static/styles/ui.styl';

type Props = {
    name: string;
};

type State = {};

class TrackedPage extends React.PureComponent<Props, State> {
    public componentDidMount() {
        const { name } = this.props;
        analytics.trackPageView(name);
    }

    public render() {
        return this.props.children;
    }
}

export default TrackedPage;
