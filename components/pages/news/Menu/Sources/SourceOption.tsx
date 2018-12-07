import classNames from 'classnames';
import * as React from 'react';

type Props = {
    active: boolean;
};

const SourceOption: React.SFC<Props> = ({ active }) => (
    <li
        className={classNames('news-menu-sources-open-option', {
            'news-menu-sources-open-option--active': active,
        })}
    >
        {console.log(active)}
        <input type="checkbox" className="news-menu-sources-open-option-input" />
        <label htmlFor="" className="news-menu-sources-open-option-label">
            <img src="" alt="" className="news-menu-sources-open-option-logo" />
            <span className="news-menu-sources-open-option-name">Thrasher Magazine</span>
        </label>
    </li>
);

export default SourceOption;
