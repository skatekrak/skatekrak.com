import React from 'react';
import { connect } from 'react-redux';

import { Language } from 'rss-feed';
import { selectLanguage } from 'store/feed/actions';

type Props = {
    language: Language;
    dispatch: (fct: any) => void;
};

class LanguageFilter extends React.PureComponent<Props, {}> {
    public render() {
        const { language } = this.props;

        return (
            <li className="feed-sidebar-nav-main-controls-languages-item-container">
                <button
                    className="feed-sidebar-nav-main-controls-languages-item"
                    onClick={this.handleLanguageFilterClick}
                >
                    <img
                        src={this.getIcon(language)}
                        alt={language.isoCode}
                        className="feed-sidebar-nav-main-controls-languages-item-flag"
                    />
                    <span className="feed-sidebar-nav-main-controls-languages-item-name">{language.isoCode}</span>
                </button>
            </li>
        );
    }

    private getIcon(language: Language): string {
        return language.image;
    }

    private handleLanguageFilterClick = () => {
        this.props.dispatch(selectLanguage(this.props.language));
    };
}

export default connect()(LanguageFilter);
