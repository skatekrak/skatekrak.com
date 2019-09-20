import classNames from 'classnames';
import Router, { withRouter, WithRouterProps } from 'next/router';
import React from 'react';
import { connect } from 'react-redux';

import Types from 'Types';

import IconCross from 'components/Ui/Icons/Cross';
import { search } from 'store/feed/actions';

type QueryProps = {
    query: string;
};

type Props = {
    nbFilters: number;
    search?: string;
    dispatch: (fct: any) => void;
};

type State = {
    sendRequestTimeout?: NodeJS.Timeout;
    hasValue: boolean;
};

class SearchBar extends React.PureComponent<WithRouterProps<QueryProps> & Props, State> {
    public state: State = {
        sendRequestTimeout: undefined,
        hasValue: false,
    };

    public componentDidMount() {
        const value = this.props.router.query.query;
        if (value) {
            this.delayedSearch(value);
            this.setState({ hasValue: true });
        }
    }

    public render() {
        return (
            <div className="feed-searchbar">
                <input
                    id="feed-searchbar-input"
                    className={classNames('feed-searchbar-input', {
                        'feed-searchbar-input--has-value': this.state.hasValue,
                    })}
                    type="text"
                    defaultValue={this.props.search}
                    placeholder="Search"
                    onChange={this.search}
                    autoComplete="off"
                />
                <button
                    className={classNames('feed-searchbar-icon', {
                        show: this.state.hasValue,
                    })}
                    onClick={this.cleanInput}
                >
                    <IconCross />
                </button>
            </div>
        );
    }

    private search = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { value } = event.target;
        this.delayedSearch(value);

        if (!value || value.length === 0) {
            this.setState({ hasValue: false });
            Router.replace('/news');
        } else {
            this.setState({ hasValue: true });
            Router.replace(`/news?query=${value}`);
        }
    };

    private delayedSearch = (value: string) => {
        if (this.state.sendRequestTimeout) {
            clearTimeout(this.state.sendRequestTimeout);
        }

        const sendRequestTimeout: NodeJS.Timeout = setTimeout(() => {
            this.props.dispatch(search(value));
        }, 400);

        this.setState({
            sendRequestTimeout,
        });
    };

    private cleanInput = () => {
        (document.getElementById('feed-searchbar-input') as HTMLInputElement).value = '';
        this.setState({ hasValue: false });
        Router.replace('/news');
        this.delayedSearch('');
    };
}

const mapStateToProps = ({ news }: Types.RootState) => {
    return { search: news.search };
};

export default withRouter(connect(mapStateToProps)(SearchBar));
