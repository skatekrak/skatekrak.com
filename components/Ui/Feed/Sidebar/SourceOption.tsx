import classNames from 'classnames';
import React from 'react';

import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import Analytics from 'lib/analytics';
import { Source } from 'rss-feed';

type SourceOptionProps = {
    source: Source;
    isActive: boolean;
    loading: boolean;
    toggle: (source: Source) => void;
};

const SourceOption = ({ source, loading, isActive, toggle }: SourceOptionProps) => {
    const handleSourceOptionClick = () => {
        if (isActive) {
            Analytics.trackEvent('Click', 'Filter_Unselect', { name: source.label, value: 1 });
        } else {
            Analytics.trackEvent('Click', 'Filter_Select', { name: source.label, value: 1 });
        }
        toggle(source);
    };

    return (
        <li
            className={classNames('feed-sidebar-nav-option', {
                'feed-sidebar-nav-option-without-logo': source.iconUrl == null,
                'feed-sidebar-nav-option--active': isActive,
            })}
        >
            <label
                htmlFor={`input-${source.id}`}
                className="feed-sidebar-nav-option-label"
                onClick={handleSourceOptionClick}
            >
                {source.iconUrl && (
                    <span className="feed-sidebar-nav-option-logo-container">
                        {isActive && loading ? (
                            <SpinnerCircle />
                        ) : (
                            <img src={source.iconUrl} alt="" className="feed-sidebar-nav-option-logo" />
                        )}
                    </span>
                )}
                <span className="feed-sidebar-nav-option-name">{source.label}</span>
                {!source.iconUrl && isActive && loading && <SpinnerCircle />}
            </label>
        </li>
    );
};

export default React.memo(SourceOption);
