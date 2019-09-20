import Analytics from '@thepunkclub/analytics';
import axios from 'axios';
import classNames from 'classnames';
import getConfig from 'next/config';
import React from 'react';
import { connect } from 'react-redux';

import Types from 'Types';

import LanguageFilter from 'components/pages/news/Sidebar/Nav/LanguageFilter';
import SearchBar from 'components/pages/news/Sidebar/Nav/SearchBar';
import SourceOption from 'components/pages/news/Sidebar/Nav/SourceOption';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import { FilterState } from 'lib/FilterState';
import { Language, Source } from 'rss-feed';
import { selectAllFilters, setAllSources, unselectAllFilters } from 'store/feed/actions';

type Props = {
    sidebarNavIsOpen: boolean;
    handleOpenSidebarNav: () => void;
};

class Nav extends React.PureComponent<Props> {
    public async componentDidMount() {}

    public render() {
        const { sidebarNavIsOpen, handleOpenSidebarNav } = this.props;

        return (
            <>
                <div className="feed-sidebar-nav-container">
                    <div className="feed-sidebar-nav-header">
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
                    <div className="feed-sidebar-nav-main-options">Categories</div>
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
}

export default Nav;
