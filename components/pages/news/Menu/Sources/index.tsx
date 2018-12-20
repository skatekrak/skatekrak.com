import axios from 'axios';
import classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';

import SourceOption from 'components/pages/news/Menu/Sources/SourceOption';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import { Source } from 'rss-feed';
import {
    FilterState,
    selectAllFilters,
    setAllSources,
    State as NewsState,
    unselectAllFilters,
} from 'store/reducers/news';

type Props = {
    sourcesMenuIsOpen: boolean;
    handleOpenSourcesMenu: () => void;
    news: NewsState;
    dispatch: (fct: any) => void;
};

type State = {};

class Sources extends React.PureComponent<Props, State> {
    public async componentDidMount() {
        try {
            const res = await axios.get(`${process.env.RSS_BACKEND_URL}/sources/`);
            const sources: Source[] = res.data;
            this.props.dispatch(setAllSources(sources));
        } catch (err) {
            //
        }
    }

    public render() {
        const {
            sourcesMenuIsOpen,
            handleOpenSourcesMenu,
            news: { sources },
        } = this.props;

        let length = 0;
        const items = [];
        for (const item of sources.entries()) {
            if (item[1] === FilterState.SELECTED) {
                length += 1;
            }
            items.push(<SourceOption key={item[0].id} source={item[0]} state={item[1]} />);
        }

        return (
            <div id="news-menu-sources">
                <div id="news-menu-sources-nav">
                    <span id="news-menu-sources-nav-title">From {length} sources</span>
                    <button id="news-menu-sources-nav-toggle-button" onClick={handleOpenSourcesMenu}>
                        {!sourcesMenuIsOpen ? 'Filters' : 'Close'}
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
                        <button className="news-menu-sources-open-control" onClick={this.onSelectAllClick}>
                            Select all
                        </button>
                        <button className="news-menu-sources-open-control" onClick={this.onDeselectAllClick}>
                            Deselect all
                        </button>
                    </div>
                    <form id="news-menu-sources-open-options">
                        <ul id="news-menu-sources-open-options-container">
                            {items.length === 0 && (
                                <div id="news-menu-sources-open-loader">
                                    <SpinnerCircle /> Loading magazines
                                </div>
                            )}
                            {items}
                        </ul>
                    </form>
                </div>
            </div>
        );
    }

    private onSelectAllClick = () => {
        this.props.dispatch(selectAllFilters());
    };

    private onDeselectAllClick = () => {
        this.props.dispatch(unselectAllFilters());
    };
}

export default connect((state: any) => ({ news: state.news }))(Sources);
