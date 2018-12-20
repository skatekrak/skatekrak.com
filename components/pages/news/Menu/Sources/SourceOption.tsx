import classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';

import Checkbox from 'components/Ui/Form/Checkbox';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import { Source } from 'rss-feed';
import { FilterState, toggleFilter } from 'store/reducers/news';

type Props = {
    source: Source;
    state: FilterState;
    dispatch: (fct: any) => void;
};

type State = {
    isActive: boolean;
    isLoading: boolean;
};

class SourceOption extends React.PureComponent<Props, State> {
    public static getDerivedStateFromProps(nextProps: Readonly<Props>): State {
        return {
            isActive: nextProps.state === FilterState.SELECTED || nextProps.state !== FilterState.UNSELECTED,
            isLoading:
                nextProps.state === FilterState.LOADING_TO_SELECTED ||
                nextProps.state === FilterState.LOADING_TO_UNSELECTED,
        };
    }

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
                    <img src={this.getLogoUrl(source)} alt="" className="news-menu-sources-open-option-logo" />
                    <span className="news-menu-sources-open-option-name">{source.label}</span>
                </label>
            </li>
        );
    }

    private handleSourceOptionClick = () => {
        this.props.dispatch(toggleFilter(this.props.source));
    };

    private getLogoUrl(source: Source): string {
        if (source.iconUrl) {
            return source.iconUrl;
        } else if (source.visualUrl) {
            return source.visualUrl;
        }
        return null;
    }
}

export default connect()(SourceOption);
