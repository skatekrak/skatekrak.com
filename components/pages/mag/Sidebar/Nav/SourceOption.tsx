import classNames from 'classnames';
import React from 'react';
import { useDispatch } from 'react-redux';

import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import Analytics from 'lib/analytics';
import { FilterState } from 'lib/FilterState';
import { Source } from 'rss-feed';
import { toggleFilter } from 'store/feed/actions';

type SourceOptionProps = {
    source: Source;
    state: FilterState;
};

const SourceOption = ({ source, state }: SourceOptionProps) => {
    const isLoading = state === FilterState.LOADING_TO_SELECTED || state === FilterState.LOADING_TO_UNSELECTED;
    const isActive = state === FilterState.SELECTED || state !== FilterState.UNSELECTED;

    const dispatch = useDispatch();

    const handleSourceOptionClick = () => {
        if (state === FilterState.SELECTED) {
            Analytics.trackEvent('Click', 'Filter_Unselect', { name: source.label, value: 1 });
        } else if (state === FilterState.UNSELECTED) {
            Analytics.trackEvent('Click', 'Filter_Select', { name: source.label, value: 1 });
        }
        dispatch(toggleFilter(source));
    };

    return (
        <li
            className={classNames('feed-sidebar-nav-option feed-sidebar-nav-option-without-logo', {
                'feed-sidebar-nav-option--active': isActive,
            })}
        >
            <label
                htmlFor={`input-${source.id}`}
                className="feed-sidebar-nav-option-label"
                onClick={handleSourceOptionClick}
            >
                <span className="feed-sidebar-nav-option-name">{source.label}</span>
                {isLoading && <SpinnerCircle />}
            </label>
        </li>
    );
};

export default React.memo(SourceOption);
