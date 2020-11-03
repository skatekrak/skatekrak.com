import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import Analytics from 'lib/analytics';
import { Source } from 'rss-feed';
import { RootState } from 'store/reducers';
import { toggleCategory } from 'store/mag/actions';

type SourceOptionProps = {
    source: Source;
    loading: boolean;
};

const SourceOption = ({ source, loading }: SourceOptionProps) => {
    const selectedCategories = useSelector((state: RootState) => state.mag.selectedCategories);
    const isActive = useMemo(() => {
        if (selectedCategories.size <= 0) {
            return true;
        }
        return selectedCategories.indexOf(source.id) !== -1;
    }, [selectedCategories, source.id]);

    const dispatch = useDispatch();

    const handleSourceOptionClick = () => {
        if (isActive) {
            Analytics.trackEvent('Click', 'Filter_Unselect', { name: source.label, value: 1 });
        } else {
            Analytics.trackEvent('Click', 'Filter_Select', { name: source.label, value: 1 });
        }
        dispatch(toggleCategory(source));
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
                {isActive && loading && <SpinnerCircle />}
            </label>
        </li>
    );
};

export default React.memo(SourceOption);
