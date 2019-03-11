import React from 'react';
import { connect } from 'react-redux';

import Types from 'Types';

import { search } from 'store/news/actions';

type Props = {
    nbFilters: number;
    search?: string;
    dispatch: (fct: any) => void;
};

type State = {
    sendRequestTimeout?: NodeJS.Timeout;
};

class SearchBar extends React.PureComponent<Props, State> {
    public state: State = {
        sendRequestTimeout: undefined,
    };

    public render() {
        return (
            <input
                className="feed-searchbar"
                type="text"
                defaultValue={this.props.search}
                placeholder="Search"
                onChange={this.search}
            />
        );
    }

    private search = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.delayedSearch(event.target.value);
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
}

const mapStateToProps = ({ news }: Types.RootState) => {
    return { search: news.search };
};

export default connect(mapStateToProps)(SearchBar);
