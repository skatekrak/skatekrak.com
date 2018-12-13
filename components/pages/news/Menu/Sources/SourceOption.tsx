import classNames from 'classnames';
import * as React from 'react';

import Checkbox from 'components/Ui/Form/Checkbox';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';

type Props = {
    isActive: boolean;
    name: string;
    id: string;
    img: string;
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
        const { id, name, img } = this.props;
        return (
            <li
                className={classNames('news-menu-sources-open-option', {
                    'news-menu-sources-open-option--active': isActive,
                })}
            >
                {isLoading ? <SpinnerCircle /> : <Checkbox checked={isActive} id={id} />}
                <label
                    htmlFor={`input-${id}`}
                    className="news-menu-sources-open-option-label"
                    onClick={this.handleSourceOptionClick}
                >
                    <img src={img} alt="" className="news-menu-sources-open-option-logo" />
                    <span className="news-menu-sources-open-option-name">{name}</span>
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
