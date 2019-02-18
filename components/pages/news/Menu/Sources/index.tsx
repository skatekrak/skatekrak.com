import Analytics from '@thepunkclub/analytics';
import axios from 'axios';
import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';

import Types from 'Types';

import SourceOption from 'components/pages/news/Menu/Sources/SourceOption';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import { Source } from 'rss-feed';
import { selectAllFilters, setAllSources, unselectAllFilters } from 'store/news/actions';
import { FilterState } from 'store/news/reducers';

type Props = {
    sourcesMenuIsOpen: boolean;
    handleOpenSourcesMenu: () => void;
    sources: Map<Source, FilterState>;
    dispatch: (fct: any) => void;
};

class Sources extends React.PureComponent<Props> {
    public async componentDidMount() {
        try {
            const res = await axios.get(`${process.env.RSS_BACKEND_URL}/sources`);
            const sources: Source[] = res.data;
            this.props.dispatch(setAllSources(sources));
        } catch (err) {
            //
        }
    }

    public render() {
        const { sourcesMenuIsOpen, handleOpenSourcesMenu, sources } = this.props;

        let length = 0;
        const items = [];
        if (sources instanceof Map) {
            for (const [source, state] of sources.entries()) {
                if (state === FilterState.SELECTED) {
                    length += 1;
                }
                items.push(<SourceOption key={source.id} source={source} state={state} />);
            }
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
        if (this.props.sources.size > 0) {
            Analytics.default().trackEvent('Click', 'Filter_Select_All', { value: 1 });
        }
        this.props.dispatch(selectAllFilters());
    };

    private onDeselectAllClick = () => {
        if (this.props.sources.size > 0) {
            Analytics.default().trackEvent('Click', 'Filter_Unselect_All', { value: 1 });
        }
        this.props.dispatch(unselectAllFilters());
    };
}

const mapStateToProps = ({ news }: Types.RootState) => {
    return { sources: news.sources };
};

export default connect(mapStateToProps)(Sources);
