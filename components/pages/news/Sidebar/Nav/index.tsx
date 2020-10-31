import classNames from 'classnames';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import LanguageFilter from 'components/pages/news/Sidebar/Nav/LanguageFilter';
import SearchBar from 'components/pages/news/Sidebar/Nav/SearchBar';
import SourceOption from 'components/pages/news/Sidebar/Nav/SourceOption';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import Analytics from 'lib/analytics';
import { FilterState } from 'lib/FilterState';
import { selectAllFilters, setAllSources, unselectAllFilters } from 'store/feed/actions';
import { RootState } from 'store/reducers';
import useNewsSources from 'lib/hook/news/sources';

type NewsSourcesProps = {
    navIsOpen: boolean;
    handleOpenSourcesMenu: () => void;
};

const Sources = ({ navIsOpen, handleOpenSourcesMenu }: NewsSourcesProps) => {
    const dispatch = useDispatch();
    const sources = useSelector((state: RootState) => state.news.sources);
    const languages = useSelector((state: RootState) => state.news.languages);

    const { data } = useNewsSources();

    useEffect(() => {
        dispatch(setAllSources(data ?? []));
    }, [data, dispatch]);

    const onSelectAllClick = () => {
        if (sources.size > 0) {
            Analytics.trackEvent('Click', 'Filter_Select_All', { value: 1 });
        }
        dispatch(selectAllFilters());
    };

    const onDeselectAllClick = () => {
        if (sources.size > 0) {
            Analytics.trackEvent('Click', 'Filter_Unselect_All', { value: 1 });
        }
        dispatch(unselectAllFilters());
    };

    const [items, length] = useMemo(() => {
        let _length = 0;
        const _items = [];
        if (sources instanceof Map) {
            for (const [source, state] of sources.entries()) {
                if (state === FilterState.SELECTED) {
                    _length += 1;
                }
                _items.push(<SourceOption key={source.id} source={source} state={state} />);
            }
        }

        return [_items, _length];
    }, [sources]);

    return (
        <>
            <div className="feed-sidebar-nav-container">
                <div className="feed-sidebar-nav-header">
                    <span className="feed-sidebar-nav-header-title">
                        From {length} source{`${length > 1 ? 's' : ''}`}
                    </span>
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
                        {languages && languages.map((language, i) => <LanguageFilter key={i} language={language} />)}
                    </ul>
                    <div className="feed-sidebar-nav-main-controls-select">
                        <button className="feed-sidebar-nav-main-controls-select-item" onClick={onSelectAllClick}>
                            Select all
                        </button>
                        <button className="feed-sidebar-nav-main-controls-select-item" onClick={onDeselectAllClick}>
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
};

export default Sources;
