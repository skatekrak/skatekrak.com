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
            <li>
                <label onClick={this.handleLanguageFilterClick}>
                    <img src={language.image} alt={language.isoCode} width={15} />
                    <span>{language.name}</span>
                </label>
            </li>
        );
    }

    private handleLanguageFilterClick = () => {
        this.props.dispatch(selectLanguage(this.props.language));
    };
}

export default connect()(LanguageFilter);
