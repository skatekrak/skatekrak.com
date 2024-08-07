import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import LanguageFilter from '@/components/Ui/Feed/Sidebar/LanguageFilter';
import SourceOption from '@/components/Ui/Feed/Sidebar/SourceOption';
import { SpinnerCircle } from '@/components/Ui/Icons/Spinners';
import Analytics from '@/lib/analytics';
import { RootState } from '@/store';
import useNewsSources from '@/lib/hook/news/sources';
import useNewsLanguages from '@/lib/hook/news/languages';
import { resetNews, selectNewsSources, toggleNewsSource } from '@/store/news/slice';
import { Language } from 'rss-feed';
import useNewsContent from '@/lib/hook/news/contents';

type NewsSourcesProps = {
    navIsOpen: boolean;
    handleOpenSourcesMenu: () => void;
};

const Sources = ({ navIsOpen, handleOpenSourcesMenu }: NewsSourcesProps) => {
    const dispatch = useDispatch();
    const selectedSources = useSelector((state: RootState) => state.news.selectSources);

    const { data: sources, isLoading } = useNewsSources();
    const { data: languages } = useNewsLanguages();

    const { isFetching } = useNewsContent({
        sources: selectedSources,
    });

    const onSelectAllClick = () => {
        if (sources != null && sources.length > 0) {
            Analytics.trackEvent('Click', 'Filter_Select_All', { value: 1 });
        }
        dispatch(resetNews(undefined));
    };

    const isActive = (id: string): boolean => {
        if (selectedSources.length <= 0) {
            return true;
        }
        return selectedSources.indexOf(id) !== -1;
    };

    const length = useMemo(() => {
        if (selectedSources.length > 0) {
            return selectedSources.length;
        }
        return (sources ?? []).length;
    }, [sources, selectedSources]);

    const toggleLanguage = (language: Language) => {
        const sourcesToSelect = sources?.filter((source) => source.lang.isoCode === language.isoCode);
        if (sourcesToSelect != null) {
            dispatch(selectNewsSources(sourcesToSelect));
        }
    };

    const toggleSource = (id: string) => {
        dispatch(toggleNewsSource(id));
    };

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
            </div>
            <div
                className={classNames('feed-sidebar-nav-main', {
                    'feed-sidebar-nav-main--open': navIsOpen,
                })}
            >
                <div className="feed-sidebar-nav-main-controls">
                    <ul className="feed-sidebar-nav-main-controls-languages">
                        {languages &&
                            languages.map((language, i) => (
                                <LanguageFilter key={i} language={language} toggle={toggleLanguage} />
                            ))}
                    </ul>
                    <div className="feed-sidebar-nav-main-controls-select">
                        <button className="feed-sidebar-nav-main-controls-select-item" onClick={onSelectAllClick}>
                            Select all
                        </button>
                    </div>
                </div>
                <form className="feed-sidebar-nav-main-options">
                    <ul className="feed-sidebar-nav-main-options-container">
                        {isLoading && (
                            <div className="feed-sidebar-nav-main-loader">
                                <SpinnerCircle /> Loading magazines
                            </div>
                        )}
                        {sources != null &&
                            sources.map((source) => (
                                <SourceOption
                                    key={source.id}
                                    id={`${source.id}`}
                                    title={source.shortTitle}
                                    iconUrl={source.iconUrl}
                                    loading={isFetching}
                                    isActive={isActive(`${source.id}`)}
                                    toggle={toggleSource}
                                />
                            ))}
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
