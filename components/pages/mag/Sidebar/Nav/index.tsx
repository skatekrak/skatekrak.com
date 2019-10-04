import Analytics from '@thepunkclub/analytics';
import axios from 'axios';
import classNames from 'classnames';
import React from 'react';

import SourceOption from 'components/pages/mag/Sidebar/Nav/SourceOption';
import SearchBar from 'components/pages/news/Sidebar/Nav/SearchBar';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';

type Props = {
    sidebarNavIsOpen: boolean;
    handleOpenSidebarNav: () => void;
};

type State = {
    categories: any[];
    isLoading: boolean;
};

class Nav extends React.PureComponent<Props, State> {
    public state: State = {
        categories: [],
        isLoading: false,
    };

    public async componentDidMount() {
        try {
            const res = await axios.get(`https://mag.skatekrak.com/wp-json/wp/v2/categories`);

            if (res.data) {
                const categories = res.data;
                this.setState({ categories });
            }
        } catch (err) {
            // console.log(err);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    public render() {
        const { sidebarNavIsOpen, handleOpenSidebarNav } = this.props;
        const { categories } = this.state;

        return (
            <>
                <div className="feed-sidebar-nav-container">
                    <div className="feed-sidebar-nav-header">
                        <button className="feed-sidebar-nav-header-toggle-button" onClick={handleOpenSidebarNav}>
                            {!sidebarNavIsOpen ? 'Categories' : 'Close'}
                        </button>
                    </div>
                    <SearchBar nbFilters={0} />
                </div>
                <div
                    className={classNames('feed-sidebar-nav-main', {
                        'feed-sidebar-nav-main--open': sidebarNavIsOpen,
                    })}
                >
                    <div className="feed-sidebar-nav-main-options">
                        <p className="feed-sidebar-nav-header-small-title">Categories</p>
                        <ul className="feed-sidebar-nav-main-options-container">
                            {categories.length === 0 && (
                                <div className="feed-sidebar-nav-main-loader">
                                    <SpinnerCircle /> Loading categories
                                </div>
                            )}
                            {categories &&
                                categories.map((category) => <SourceOption key={category.id} source={category} />)}
                        </ul>
                    </div>
                    <p className="feed-sidebar-nav-main-request">
                        You'd be down to contribute - email{' '}
                        <a href="mailto:mag@skatekrak.com" className="feed-sidebar-nav-main-request-mail">
                            mag@skatekrak.com
                        </a>
                    </p>
                </div>
            </>
        );
    }
}

export default Nav;
