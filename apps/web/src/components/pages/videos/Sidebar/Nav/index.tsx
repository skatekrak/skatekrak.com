import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import LanguageFilter from '@/components/Ui/Feed/Sidebar/LanguageFilter';
import { SpinnerCircle } from '@/components/Ui/Icons/Spinners';
import Analytics from '@/lib/analytics';
import { Language } from 'rss-feed';
import useLanguages from '@/lib/hook/languages';
import useVideosSources from '@/lib/hook/videos/sources';
import { resetVideos, selectVideosSources, toggleVideosSource } from '@/store/videos/slice';
import SourceOption from '@/components/Ui/Feed/Sidebar/SourceOption';
import { RootState } from '@/store';
import useVideos from '@/lib/hook/videos/videos';

type SourcesProps = {
    navIsOpen: boolean;
    handleOpenSourcesMenu: () => void;
};

const Sources = ({ navIsOpen, handleOpenSourcesMenu }: SourcesProps) => {
    const dispatch = useDispatch();
    const { data: sources, isLoading } = useVideosSources();
    const languages = useLanguages(sources ?? []);
    const selectedSources = useSelector((state: RootState) => state.video.selectSources);
    const query = useSelector((state: RootState) => state.video.search);

    const { isFetching } = useVideos({ sources: selectedSources, query });

    const onSelectAllClick = () => {
        if (sources != null && sources.length > 0) {
            Analytics.trackEvent('Click', 'Filter_Select_All', { value: 1 });
        }
        dispatch(resetVideos());
    };

    const length = useMemo(() => {
        if (selectedSources.length > 0) {
            return selectedSources.length;
        }
        return (sources ?? []).length;
    }, [sources, selectedSources]);

    const isActive = (id: string): boolean => {
        if (selectedSources.length <= 0) {
            return true;
        }
        return selectedSources.indexOf(id) !== -1;
    };

    const toggleLanguage = (language: Language) => {
        const sourcesToSelect = sources?.filter((source) => source.lang.isoCode === language.isoCode);
        if (sourcesToSelect) {
            dispatch(selectVideosSources(sourcesToSelect));
        }
    };

    const toggleSource = (id: string) => {
        dispatch(toggleVideosSource(id));
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
                {/* <SearchBar value={query} onValueChange={onQueryChange} /> */}
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
                                <SpinnerCircle /> Loading channels
                            </div>
                        )}
                        {sources != null &&
                            sources.map((source) => (
                                <SourceOption
                                    key={source.id}
                                    id={String(source.id)}
                                    title={source.shortTitle}
                                    iconUrl={source.iconUrl}
                                    isActive={isActive(String(source.id))}
                                    loading={isFetching}
                                    toggle={toggleSource}
                                />
                            ))}
                    </ul>
                </form>
                <p className="feed-sidebar-nav-main-request">
                    You'd be down to add your youtube channel source here - email{' '}
                    <a href="mailto:news@skatekrak.com" className="feed-sidebar-nav-main-request-mail">
                        news@skatekrak.com
                    </a>
                </p>
            </div>
        </>
    );
};

export default Sources;
