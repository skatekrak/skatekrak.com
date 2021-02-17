import classNames from 'classnames';
import React from 'react';

import IconCross from 'components/Ui/Icons/Cross';

type SearchBarProps = {
    value: string;
    onValueChange: (value: string) => void;
};

const SearchBar = ({ value, onValueChange }: SearchBarProps) => {
    const hasValue = value != null && value !== '';

    const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange(evt.target.value);
    };

    const onCleanInput = () => {
        onValueChange('');
    };

    return (
        <div className="feed-searchbar">
            <input
                id="feed-searchbar-input"
                className={classNames('feed-searchbar-input', {
                    'feed-searchbar-input--has-value': hasValue,
                })}
                type="text"
                value={value}
                placeholder="Search"
                onChange={onChange}
                autoComplete="off"
            />
            <button
                className={classNames('feed-searchbar-icon', {
                    show: hasValue,
                })}
                onClick={onCleanInput}
            >
                <IconCross />
            </button>
        </div>
    );
};

export default SearchBar;
