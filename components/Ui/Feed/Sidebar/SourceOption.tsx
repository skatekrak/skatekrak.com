import classNames from 'classnames';
import React from 'react';

import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import Analytics from 'lib/analytics';

type SourceOptionProps = {
    id: string;
    title: string;
    iconUrl?: string;
    isActive: boolean;
    loading: boolean;
    toggle: (id: string) => void;
};

const SourceOption = ({ id, title, iconUrl, loading, isActive, toggle }: SourceOptionProps) => {
    const handleSourceOptionClick = () => {
        if (isActive) {
            Analytics.trackEvent('Click', 'Filter_Unselect', { name: title, value: 1 });
        } else {
            Analytics.trackEvent('Click', 'Filter_Select', { name: title, value: 1 });
        }
        toggle(id);
    };

    return (
        <li
            className={classNames('feed-sidebar-nav-option', {
                'feed-sidebar-nav-option-without-logo': iconUrl == null,
                'feed-sidebar-nav-option--active': isActive,
            })}
        >
            <label htmlFor={`input-${id}`} className="feed-sidebar-nav-option-label" onClick={handleSourceOptionClick}>
                {iconUrl && (
                    <span className="feed-sidebar-nav-option-logo-container">
                        {isActive && loading ? (
                            <SpinnerCircle />
                        ) : (
                            <img src={iconUrl} alt="" className="feed-sidebar-nav-option-logo" />
                        )}
                    </span>
                )}
                <span className="feed-sidebar-nav-option-name">{title}</span>
                {iconUrl && isActive && loading && <SpinnerCircle />}
            </label>
        </li>
    );
};

export default React.memo(SourceOption);
