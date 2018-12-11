import classNames from 'classnames';
import * as React from 'react';

import SourceOption from 'components/pages/news/Menu/Sources/SourceOption';

type State = {};

type Props = {
    sourcesMenuIsOpen: boolean;
    handleOpenSourcesMenu: () => void;
};

const fakeSourceOptions = [
    {
        isActive: true,
        name: 'Confusion',
        id: 'confusion',
        img: '/static/images/mags-logo/confusion.svg',
    },
    {
        isActive: false,
        name: 'Grey',
        id: 'grey',
        img: '/static/images/mags-logo/grey.svg',
    },
    {
        isActive: false,
        name: 'VHS mag',
        id: 'vhs',
        img: '/static/images/mags-logo/vhs-mag.png',
    },
    {
        isActive: true,
        name: 'Street piracy',
        id: 'street-piracy',
        img: '/static/images/mags-logo/street-piracy.svg',
    },
];

class Sources extends React.PureComponent<Props, State> {
    public state: State = {};

    public render() {
        const { sourcesMenuIsOpen, handleOpenSourcesMenu } = this.props;
        return (
            <div id="news-menu-sources">
                <div id="news-menu-sources-nav">
                    <span id="news-menu-sources-nav-title">Sources(38)</span>
                    <button id="news-menu-sources-nav-toggle-button" onClick={handleOpenSourcesMenu}>
                        {!sourcesMenuIsOpen ? 'View all' : 'Close'}
                    </button>
                </div>
                <div id="news-menu-sources-container">
                    <div
                        id="news-menu-sources-open"
                        className={classNames('news-menu-sources-open', {
                            'news-menu-sources-open--open': sourcesMenuIsOpen,
                        })}
                    >
                        <p id="news-menu-sources-open-request">
                            You'd be down to add your blog/mag source here - email{' '}
                            <a href="mailto:news@skatekrak.com" id="news-menu-sources-open-request-mail">
                                news@skatekrak.com
                            </a>
                        </p>
                        <div id="news-menu-sources-open-controls">
                            <button className="news-menu-sources-open-control">Select all</button>
                            <button className="news-menu-sources-open-control">Deselect all</button>
                        </div>
                        <form id="news-menu-sources-open-options">
                            <ul id="news-menu-sources-open-options-container">
                                {fakeSourceOptions.map((option) => (
                                    <SourceOption
                                        isActive={option.isActive}
                                        name={option.name}
                                        id={option.id}
                                        img={option.img}
                                    />
                                ))}
                            </ul>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Sources;
