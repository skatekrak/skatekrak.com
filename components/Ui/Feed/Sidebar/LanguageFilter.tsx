import React from 'react';

import { Language } from 'rss-feed';

type LanguageFilterProps = {
    language: Language;
    toggle: (language: Language) => void;
};

const LanguageFilter = ({ language, toggle }: LanguageFilterProps) => {
    return (
        <li className="feed-sidebar-nav-main-controls-languages-item-container">
            <button className="feed-sidebar-nav-main-controls-languages-item" onClick={() => toggle(language)}>
                <img
                    src={language.image}
                    alt={language.isoCode}
                    className="feed-sidebar-nav-main-controls-languages-item-flag"
                />
                <span className="feed-sidebar-nav-main-controls-languages-item-name">{language.isoCode}</span>
            </button>
        </li>
    );
};

export default React.memo(LanguageFilter);
