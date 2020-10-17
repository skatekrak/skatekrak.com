import React from 'react';

import Analytics from 'lib/analytics';

type Props = {
    name: string;
    initial: boolean;
};

class TrackedPage extends React.Component<Props> {
    public static defaultProps = {
        initial: true,
    };

    public componentDidMount() {
        Analytics.init('UA-54975174-1');
        if (this.props.initial) {
            // console.log(`Tracked Initial Page ${this.props.name}`);
            Analytics.trackPageView(this.props.name);
        }
    }

    public componentDidUpdate(prevPros: Readonly<Props>) {
        if (prevPros.name !== this.props.name) {
            // console.log(`Tracked Update Page ${this.props.name}`);
            Analytics.trackPageView(this.props.name);
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
