import Analytics from '@thepunkclub/analytics';
import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';

import Checkbox from 'components/Ui/Form/Checkbox';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import { Source } from 'rss-feed';
import { toggleFilter } from 'store/news/actions';
import { FilterState } from 'store/news/reducers';

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
                className={classNames('feed-sidebar-nav-option', {
                    'feed-sidebar-nav-option--active': isActive,
                })}
            >
                {isLoading ? <SpinnerCircle /> : <Checkbox checked={isActive} id={source.id} />}
                <label
                    htmlFor={`input-${source.id}`}
                    className="feed-sidebar-nav-option-label"
                    onClick={this.handleSourceOptionClick}
                >
                    <img src={this.getIcon(source)} alt="" className="feed-sidebar-nav-option-logo" />
                    <span className="feed-sidebar-nav-option-name">{source.label}</span>
                </label>
            </li>
        );
    }

    private getIcon(source: Source): string {
        return `${process.env.CACHING_URL}/${encodeURIComponent(source.iconUrl)}`;
    }

    private handleSourceOptionClick = () => {
        if (this.props.state === FilterState.SELECTED) {
            Analytics.default().trackEvent('Click', 'Filter_Unselect', { name: this.props.source.label, value: 1 });
        } else if (this.props.state === FilterState.UNSELECTED) {
            Analytics.default().trackEvent('Click', 'Filter_Select', { name: this.props.source.label, value: 1 });
        }
        this.props.dispatch(toggleFilter(this.props.source));
    };
}

export default connect()(SourceOption);