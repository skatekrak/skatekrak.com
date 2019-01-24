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
    initial: boolean;
};

type State = {};

class TrackedPage extends React.Component<Props, State> {
    public static defaultProps = {
        initial: true,
    };

    public componentDidMount() {
        analytics.init('2', {
            cookieDomain: '*.skatekrak.com',
            crossDomainLinking: true,
            domains: ['*.skatekrak.com', '*.krakbox.com'],
        });
        if (this.props.initial) {
            // console.log(`Tracked Initial Page ${this.props.name}`);
            analytics.trackPageView(this.props.name);
            analytics.trackLinks();
        }
    }

    public componentDidUpdate(prevPros: Readonly<Props>) {
        if (prevPros.name !== this.props.name) {
            // console.log(`Tracked Update Page ${this.props.name}`);
            analytics.trackPageView(this.props.name);
        }
    }

    public render() {
        if (this.props.children) {
            return this.props.children;
        }
        return null;
    }
}

export default TrackedPage;
