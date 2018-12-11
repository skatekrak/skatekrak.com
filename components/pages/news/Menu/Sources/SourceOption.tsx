import classNames from 'classnames';
import * as React from 'react';

import Checkbox from 'components/Ui/Form/Checkbox';

type Props = {
    isActive: boolean;
    name: string;
    id: string;
    img: string;
};

const SourceOption: React.SFC<Props> = ({ isActive, name, id, img }) => (
    <li
        className={classNames('news-menu-sources-open-option', {
            'news-menu-sources-open-option--active': isActive,
        })}
    >
        <Checkbox checked={isActive} id={id} />
        <label htmlFor={`input-${id}`} className="news-menu-sources-open-option-label">
            <img src={img} alt="" className="news-menu-sources-open-option-logo" />
            <span className="news-menu-sources-open-option-name">{name}</span>
        </label>
    </li>
);

export default SourceOption;
