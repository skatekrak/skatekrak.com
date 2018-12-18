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

class TrackedPage extends React.Component<Props, State> {
    public componentDidMount() {
        const { name } = this.props;
        analytics.init('2', {
            cookieDomain: '*.skatekrak.com',
            crossDomainLinking: true,
            domains: ['*.skatekrak.com', '*.krakbox.com'],
        });
        analytics.trackPageView(name);
    }

    public render() {
        return this.props.children;
    }
}

export default TrackedPage;
