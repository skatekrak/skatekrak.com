import axios from 'axios';
import classNames from 'classnames';
import * as React from 'react';

import SourceOption from 'components/pages/news/Menu/Sources/SourceOption';
import { Source } from 'types/Source';

type Props = {
    sourcesMenuIsOpen: boolean;
    handleOpenSourcesMenu: () => void;
};

type State = {
    sources: Source[];
};

class Sources extends React.PureComponent<Props, State> {
    public state: State = {
        sources: [],
    };

    public async componentDidMount() {
        try {
            const res = await axios.get(`${process.env.RSS_BACKEND_URL}/sources/`);
            const sources: Source[] = res.data;
            this.setState({ sources });
        } catch (err) {
            //
        }
    }

    public render() {
        const { sourcesMenuIsOpen, handleOpenSourcesMenu } = this.props;
        const { sources } = this.state;

        return (
            <div id="news-menu-sources">
                <div id="news-menu-sources-nav">
                    <span id="news-menu-sources-nav-title">From {sources.length} magazines</span>
                    <button id="news-menu-sources-nav-toggle-button" onClick={handleOpenSourcesMenu}>
                        {!sourcesMenuIsOpen ? 'Filter' : 'Close'}
                    </button>
                </div>
                <div
                    id="news-menu-sources-open"
                    className={classNames('news-menu-sources-open', {
                        'news-menu-sources-open--open': sourcesMenuIsOpen,
                    })}
                >
                    <p id="news-menu-sources-open-request">
                        You'd be down to add your blog/mag source here - email{' '}
                        <a href="mailto:news@skatekrak.com" id="news-menu-sources-open-request-mail">
                            news@skatekrak.com
                        </a>
                    </p>
                    <div id="news-menu-sources-open-controls">
                        <button className="news-menu-sources-open-control">Select all</button>
                        <button className="news-menu-sources-open-control">Deselect all</button>
                    </div>
                    <form id="news-menu-sources-open-options">
                        <ul id="news-menu-sources-open-options-container">
                            {sources.map((source) => (
                                <SourceOption key={source.id} isActive={true} source={source} />
                            ))}
                        </ul>
                    </form>
                </div>
            </div>
        );
    }
}

export default Sources;
