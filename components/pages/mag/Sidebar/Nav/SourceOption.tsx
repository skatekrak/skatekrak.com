import Analytics from '@thepunkclub/analytics';
import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';

import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
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
                className={classNames('feed-sidebar-nav-option feed-sidebar-nav-option-without-logo', {
                    'feed-sidebar-nav-option--active': isActive,
                })}
            >
                <label
                    htmlFor={`input-${source.id}`}
                    className="feed-sidebar-nav-option-label"
                    onClick={this.handleSourceOptionClick}
                >
                    <span className="feed-sidebar-nav-option-name">{source.label}</span>
                    {isLoading && <SpinnerCircle />}
                </label>
            </li>
        );
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