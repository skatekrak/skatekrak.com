import Analytics from '@thepunkclub/analytics';
import axios from 'axios';
import classNames from 'classnames';
import getConfig from 'next/config';
import React from 'react';
import { connect } from 'react-redux';

import Types from 'Types';

import LanguageFilter from 'components/pages/news/Sidebar/Nav/LanguageFilter';
import SourceOption from 'components/pages/news/Sidebar/Nav/SourceOption';
import SearchBar from 'components/Ui/Feed/SearchBar';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import { Language, Source } from 'rss-feed';
import { selectAllFilters, setAllSources, unselectAllFilters } from 'store/news/actions';
import { FilterState } from 'store/news/reducers';

type Props = {
    navIsOpen: boolean;
    handleOpenSourcesMenu: () => void;
    sources: Map<Source, FilterState>;
    languages: Language[];

    setAllSources: (sources: Source[]) => void;
    selectAllFilters: () => void;
    unselectAllFilters: () => void;
};

class Sources extends React.PureComponent<Props> {
    public async componentDidMount() {
        try {
            const res = await axios.get<Source[]>(`${getConfig().publicRuntimeConfig.RSS_BACKEND_URL}/sources`);
            this.props.setAllSources(res.data);
        } catch (err) {
            //
        }
    }

    public render() {
        const { navIsOpen, handleOpenSourcesMenu, sources, languages } = this.props;

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
            <>
                <div className="feed-sidebar-nav-container">
                    <div className="feed-sidebar-nav-header">
                        <span className="feed-sidebar-nav-header-title">From {length} sources</span>
                        <button className="feed-sidebar-nav-header-toggle-button" onClick={handleOpenSourcesMenu}>
                            {!navIsOpen ? 'Filters' : 'Close'}
                        </button>
                    </div>
                    <SearchBar nbFilters={length} />
                </div>
                <div
                    className={classNames('feed-sidebar-nav-main', {
                        'feed-sidebar-nav-main--open': navIsOpen,
                    })}
                >
                    <div className="feed-sidebar-nav-main-controls">
                        <ul className="feed-sidebar-nav-main-controls-languages">
                            {languages &&
                                languages.map((language, i) => <LanguageFilter key={i} language={language} />)}
                        </ul>
                        <div className="feed-sidebar-nav-main-controls-select">
                            <button
                                className="feed-sidebar-nav-main-controls-select-item"
                                onClick={this.onSelectAllClick}
                            >
                                Select all
                            </button>
                            <button
                                className="feed-sidebar-nav-main-controls-select-item"
                                onClick={this.onDeselectAllClick}
                            >
                                Deselect all
                            </button>
                        </div>
                    </div>
                    <form className="feed-sidebar-nav-main-options">
                        <ul className="feed-sidebar-nav-main-options-container">
                            {items.length === 0 && (
                                <div className="feed-sidebar-nav-main-loader">
                                    <SpinnerCircle /> Loading magazines
                                </div>
                            )}
                            {items}
                        </ul>
                    </form>
                    <p className="feed-sidebar-nav-main-request">
                        You'd be down to add your blog/mag source here - email{' '}
                        <a href="mailto:news@skatekrak.com" className="feed-sidebar-nav-main-request-mail">
                            news@skatekrak.com
                        </a>
                    </p>
                </div>
            </>
        );
    }

    private onSelectAllClick = () => {
        if (this.props.sources.size > 0) {
            Analytics.default().trackEvent('Click', 'Filter_Select_All', { value: 1 });
        }
        this.props.selectAllFilters();
    };

    private onDeselectAllClick = () => {
        if (this.props.sources.size > 0) {
            Analytics.default().trackEvent('Click', 'Filter_Unselect_All', { value: 1 });
        }
        this.props.unselectAllFilters();
    };
}

const mapStateToProps = ({ news }: Types.RootState) => {
    return { sources: news.sources, languages: news.languages };
};

export default connect(
    mapStateToProps,
    {
        setAllSources,
        selectAllFilters,
        unselectAllFilters,
    },
)(Sources);
