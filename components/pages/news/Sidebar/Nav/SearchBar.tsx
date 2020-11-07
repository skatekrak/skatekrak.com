import classNames from 'classnames';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import IconCross from 'components/Ui/Icons/Cross';
import { RootState } from 'store/reducers';
import { setNewsSearch } from 'store/news/actions';

const SearchBar = () => {
    const dispatch = useDispatch();
    const search = useSelector((state: RootState) => state.news.search);
    const hasValue = search != null && search !== '';

    const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setNewsSearch(evt.target.value));
    };

    const cleanInput = () => {
        dispatch(setNewsSearch(''));
    };

    return (
        <div className="feed-searchbar">
            <input
                id="feed-searchbar-input"
                className={classNames('feed-searchbar-input', {
                    'feed-searchbar-input--has-value': hasValue,
                })}
                type="text"
                value={search}
                placeholder="Search"
                onChange={onChange}
                autoComplete="off"
            />
            <button
                className={classNames('feed-searchbar-icon', {
                    show: hasValue,
                })}
                onClick={cleanInput}
            >
                <IconCross />
            </button>
        </div>
    );
};

export default SearchBar;
