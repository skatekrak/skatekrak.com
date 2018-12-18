import classNames from 'classnames';
import * as React from 'react';

import Checkbox from 'components/Ui/Form/Checkbox';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import { Source } from 'rss-feed';

type Props = {
    isActive: boolean;
    source: Source;
};

type State = {
    isActive: boolean;
    isLoading: boolean;
};

class SourceOption extends React.PureComponent<Props, State> {
    public state: State = {
        isActive: true,
        isLoading: false,
    };

    public render() {
        const { isActive, isLoading } = this.state;
        const { source } = this.props;

        return (
            <li
                className={classNames('news-menu-sources-open-option', {
                    'news-menu-sources-open-option--active': isActive,
                })}
            >
                {isLoading ? <SpinnerCircle /> : <Checkbox checked={isActive} id={source.id} />}
                <label
                    htmlFor={`input-${source.id}`}
                    className="news-menu-sources-open-option-label"
                    onClick={this.handleSourceOptionClick}
                >
                    <img src={source.logoUrl} alt="" className="news-menu-sources-open-option-logo" />
                    <span className="news-menu-sources-open-option-name">{source.label}</span>
                </label>
            </li>
        );
    }

    private handleSourceOptionClick = () => {
        const { isActive } = this.state;

        this.setState({ isLoading: true });
        setTimeout(() => {
            this.setState({ isActive: !isActive });
            this.setState({ isLoading: false });
        }, 500);
    };
}

export default SourceOption;
