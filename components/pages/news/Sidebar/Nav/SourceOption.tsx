import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';

import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import Analytics from 'lib/analytics';
import { FilterState } from 'lib/FilterState';
import { Source } from 'rss-feed';
import { toggleFilter } from 'store/feed/actions';

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
                <label
                    htmlFor={`input-${source.id}`}
                    className="feed-sidebar-nav-option-label"
                    onClick={this.handleSourceOptionClick}
                >
                    <span className="feed-sidebar-nav-option-logo-container">
                        {isLoading ? (
                            <SpinnerCircle />
                        ) : (
                            <img src={this.getIcon(source)} alt="" className="feed-sidebar-nav-option-logo" />
                        )}
                    </span>
                    <span className="feed-sidebar-nav-option-name">{source.label}</span>
                </label>
            </li>
        );
    }

    private getIcon(source: Source): string {
        return source.iconUrl;
    }

    private handleSourceOptionClick = () => {
        if (this.props.state === FilterState.SELECTED) {
            Analytics.trackEvent('Click', 'Filter_Unselect', { name: this.props.source.label, value: 1 });
        } else if (this.props.state === FilterState.UNSELECTED) {
            Analytics.trackEvent('Click', 'Filter_Select', { name: this.props.source.label, value: 1 });
        }
        this.props.dispatch(toggleFilter(this.props.source));
    };
}

export default connect()(SourceOption);
