import React from 'react';

import Nav from 'components/pages/news/Sidebar/Nav';
import Emoji from 'components/Ui/Icons/Emoji';
import ScrollTop from 'components/Ui/Utils/ScrollTop';

type State = {
    navIsOpen: boolean;
};

class Sidebar extends React.PureComponent<{}, State> {
    public state: State = {
        navIsOpen: false,
    };

    public render() {
        const { navIsOpen } = this.state;
        return (
            <div id="feed-scrolltop-hook" className="feed-sidebar-container">
                <div className="feed-sidebar-header">
                    <h1 className="feed-sidebar-header-title">
                        We all need
                        <br />
                        our daily dose{' '}
                        <span className="feed-sidebar-header-subtitle">
                            [at least] <Emoji symbol="🐙" label="Kraken" /> <Emoji symbol="📰" label="newspaper" />
                        </span>
                    </h1>
                    <p className="feed-sidebar-header-text">Our daily dose of skateboarding news.</p>
                </div>
                <Nav navIsOpen={navIsOpen} handleOpenSourcesMenu={this.handleOpenSourcesMenu} />
                <ScrollTop elementId="feed-scrolltop-hook" />
            </div>
        );
    }

    private handleOpenSourcesMenu = () => {
        const { navIsOpen } = this.state;
        this.setState({ navIsOpen: !navIsOpen });
    };
}

export default Sidebar;
