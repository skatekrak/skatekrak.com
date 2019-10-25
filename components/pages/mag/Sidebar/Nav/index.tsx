import Analytics from '@thepunkclub/analytics';
import axios from 'axios';
import classNames from 'classnames';
import getConfig from 'next/config';
import React from 'react';
import { connect } from 'react-redux';

import Types from 'Types';

import SearchBar from 'components/pages/mag/Sidebar/Nav/SearchBar';
import SourceOption from 'components/pages/mag/Sidebar/Nav/SourceOption';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import { FilterState } from 'lib/FilterState';
import { Source } from 'rss-feed';
import { selectAllFilters, setAllSources, unselectAllFilters } from 'store/feed/actions';

type Props = {
    sidebarNavIsOpen: boolean;
    handleOpenSidebarNav: () => void;
    sources: Map<Source, FilterState>;

    setAllSources: (sources: Source[]) => void;
    selectAllFilters: () => void;
    unselectAllFilters: () => void;
};

class Nav extends React.PureComponent<Props> {
    private static extractSourcesFromData(data: any[]): Source[] {
        const sources = [];
        data.forEach(item => {
            if (item.slug !== 'uncategorized') {
                sources.push({
                    id: item.id,
                    title: item.name,
                    label: item.name,
                });
            }
        });
        return sources;
    }

    public async componentDidMount() {
        try {
            const res = await axios.get(
                `${getConfig().publicRuntimeConfig.KRAKMAG_URL}/wp-json/wp/v2/categories?per_page=100`,
            );
            const sources = Nav.extractSourcesFromData(res.data);
            this.props.setAllSources(sources);
        } catch (err) {
            // console.log(err);
        }
    }

    public render() {
        const { sidebarNavIsOpen, handleOpenSidebarNav, sources } = this.props;

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
                        <span className="feed-sidebar-nav-header-title">
                            From {length} categor{`${length > 1 ? 'ies' : 'y'}`}
                        </span>
                        <button className="feed-sidebar-nav-header-toggle-button" onClick={handleOpenSidebarNav}>
                            {!sidebarNavIsOpen ? 'Categories' : 'Close'}
                        </button>
                    </div>
                    <SearchBar nbFilters={0} />
                </div>
                <div
                    className={classNames('feed-sidebar-nav-main', {
                        'feed-sidebar-nav-main--open': sidebarNavIsOpen,
                    })}
                >
                    <div className="feed-sidebar-nav-main-controls">
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
                    <div className="feed-sidebar-nav-main-options">
                        <p className="feed-sidebar-nav-header-small-title">Categories</p>
                        <ul className="feed-sidebar-nav-main-options-container">
                            {items.length === 0 && (
                                <div className="feed-sidebar-nav-main-loader">
                                    <SpinnerCircle /> Loading categories
                                </div>
                            )}
                            {items}
                        </ul>
                    </div>
                    <p className="feed-sidebar-nav-main-request">
                        You'd be down to contribute - email{' '}
                        <a href="mailto:mag@skatekrak.com" className="feed-sidebar-nav-main-request-mail">
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

const mapStateToProps = ({ mag }: Types.RootState) => {
    return { sources: mag.sources };
};

export default connect(
    mapStateToProps,
    {
        setAllSources,
        selectAllFilters,
        unselectAllFilters,
    },
)(Nav);
