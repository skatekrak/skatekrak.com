import classNames from 'classnames';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SearchBar from 'components/pages/mag/Sidebar/Nav/SearchBar';
import SourceOption from 'components/pages/mag/Sidebar/Nav/SourceOption';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import Analytics from 'lib/analytics';
import { FilterState } from 'lib/FilterState';
import { selectAllFilters, setAllSources, unselectAllFilters } from 'store/feed/actions';
import { RootState } from 'store/reducers';
import useMagCategories from 'lib/hook/mag/categories';

type NavProps = {
    sidebarNavIsOpen: boolean;
    handleOpenSidebarNav: () => void;
};

const Nav = ({ sidebarNavIsOpen, handleOpenSidebarNav }: NavProps) => {
    const dispatch = useDispatch();
    const sources = useSelector((state: RootState) => state.mag.sources);

    const { data: categories } = useMagCategories();

    useEffect(() => {
        dispatch(setAllSources(categories ?? []));
    }, [categories, dispatch]);

    const [items, length] = useMemo(() => {
        let _length = 0;
        const _items = [];
        for (const [source, state] of sources.entries()) {
            if (state === FilterState.SELECTED) {
                _length += 1;
            }
            _items.push(<SourceOption key={source.id} source={source} state={state} />);
        }
        return [_items, _length];
    }, [sources]);

    const onSelectAllClick = () => {
        if (sources.size > 0) {
            Analytics.trackEvent('Click', 'Filter_Select_All');
        }
        dispatch(selectAllFilters());
    };

    const onDeselectAllClick = () => {
        if (sources.size > 0) {
            Analytics.trackEvent('Click', 'Filter_Unselect_All');
        }
        dispatch(unselectAllFilters());
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
};

export default React.memo(Nav);
