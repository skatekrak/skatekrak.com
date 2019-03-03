import React from 'react';
import { connect } from 'react-redux';

import { Language } from 'rss-feed';
import { selectLanguage } from 'store/news/actions';

type Props = {
    language: Language;
    dispatch: (fct: any) => void;
};

class LanguageFilter extends React.PureComponent<Props, {}> {
    public render() {
        const { language } = this.props;

        return (
            <li className="news-menu-sources-open-control-language-container">
                <button className="news-menu-sources-open-control-language" onClick={this.handleLanguageFilterClick}>
                    <img
                        src={language.image}
                        alt={language.isoCode}
                        className="news-menu-sources-open-control-language-flag"
                    />
                    <span className="news-menu-sources-open-control-language-name">{language.name}</span>
                </button>
            </li>
        );
    }

    private handleLanguageFilterClick = () => {
        this.props.dispatch(selectLanguage(this.props.language));
    };
}

export default connect()(LanguageFilter);
