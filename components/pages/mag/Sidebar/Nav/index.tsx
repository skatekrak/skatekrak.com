import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SearchBar from 'components/pages/mag/Sidebar/Nav/SearchBar';
import SourceOption from 'components/pages/mag/Sidebar/Nav/SourceOption';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import Analytics from 'lib/analytics';
import { RootState } from 'store/reducers';
import useMagCategories from 'lib/hook/mag/categories';
import { resetCategories } from 'store/mag/actions';
import usePosts from 'lib/hook/mag/posts';

type NavProps = {
    sidebarNavIsOpen: boolean;
    handleOpenSidebarNav: () => void;
};

const Nav = ({ sidebarNavIsOpen, handleOpenSidebarNav }: NavProps) => {
    const dispatch = useDispatch();
    const sources = useSelector((state: RootState) => state.mag.selectedCategories);

    const { data: categories, isLoading } = useMagCategories();

    const { isFetching } = usePosts({
        per_page: 20,
        categories: sources,
    });

    /** Either the length of selected categories, or the length of every available categories */
    const length = useMemo(() => {
        if (sources.length > 0) {
            return sources.length;
        }
        return (categories ?? []).length;
    }, [sources, categories]);

    const onSelectAllClick = () => {
        if (categories.length > 0) {
            Analytics.trackEvent('Click', 'Filter_Select_All');
        }
        dispatch(resetCategories());
    };

    const onDeselectAllClick = () => {
        if (categories.length > 0) {
            Analytics.trackEvent('Click', 'Filter_Unselect_All');
        }
        dispatch(resetCategories());
    };

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
                        <button className="feed-sidebar-nav-main-controls-select-item" onClick={onSelectAllClick}>
                            Select all
                        </button>
                        <button className="feed-sidebar-nav-main-controls-select-item" onClick={onDeselectAllClick}>
                            Deselect all
                        </button>
                    </div>
                </div>
                <div className="feed-sidebar-nav-main-options">
                    <p className="feed-sidebar-nav-header-small-title">Categories</p>
                    <ul className="feed-sidebar-nav-main-options-container">
                        {isLoading && (
                            <div className="feed-sidebar-nav-main-loader">
                                <SpinnerCircle /> Loading categories
                            </div>
                        )}
                        {categories != null &&
                            categories.map((category) => (
                                <SourceOption key={category.id} source={category} loading={isFetching} />
                            ))}
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
};

export default React.memo(Nav);
