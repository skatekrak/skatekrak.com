import classNames from 'classnames';
import React, { useMemo } from 'react';

import SourceOption from 'components/Ui/Feed/Sidebar/SourceOption';
import Analytics from 'lib/analytics';
import { resetCategories, toggleCategory } from 'store/mag/slice';
import usePosts from 'lib/hook/mag/posts';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { unique, flat } from 'radash';

type NavProps = {
    sidebarNavIsOpen: boolean;
    handleOpenSidebarNav: () => void;
};

const Nav = ({ sidebarNavIsOpen, handleOpenSidebarNav }: NavProps) => {
    const dispatch = useAppDispatch();
    const sources = useAppSelector((state) => state.mag.selectedCategories);

    const articles = useAppSelector((state) => state.mag.articles);
    const categories = useMemo(() => {
        const _categories = unique(flat(articles.map((article) => article.categories)));
        return _categories.map((category) => ({
            id: category,
            label: category,
            title: category,
        }));
    }, [articles]);

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

    const isActive = (id: string): boolean => {
        if (sources.length <= 0) {
            return true;
        }
        return sources.indexOf(id) !== -1;
    };

    const toggleSource = (id: string) => {
        dispatch(toggleCategory(id));
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
                    </div>
                </div>
                <div className="feed-sidebar-nav-main-options">
                    <p className="feed-sidebar-nav-header-small-title">Categories</p>
                    <ul className="feed-sidebar-nav-main-options-container">
                        {categories != null &&
                            categories.map((category) => (
                                <SourceOption
                                    key={category.id}
                                    id={category.id}
                                    title={category.label}
                                    isActive={isActive(category.id)}
                                    loading={isFetching}
                                    toggle={toggleSource}
                                />
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
