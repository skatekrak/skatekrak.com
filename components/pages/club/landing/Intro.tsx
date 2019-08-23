import jump from 'jump.js';
import React from 'react';

import IconArrowHead from 'components/Ui/Icons/ArrowHead';
import ScrollHelper from 'lib/ScrollHelper';

type Props = {
    pricing: string;
    currency: string;
};

class Intro extends React.PureComponent<Props, {}> {
    public render() {
        return (
            <section id="club-intro">
                <div id="club-intro-content">
                    <h2 id="club-intro-content-title">Never ride alone anymore</h2>
                    <p id="club-intro-content-desc">
                        Join a global community of international skateboarders exploring the streets
                    </p>
                    <div id="club-intro-content-kraken">
                        <ul id="club-intro-content-kraken-images">
                            <li className="club-intro-content-kraken">
                                <img
                                    src="https://res.skatekrak.com/static/skatekrak.com/Krakens/kev_low.jpg"
                                    alt="Kraken"
                                />
                            </li>
                            <li className="club-intro-content-kraken">
                                <img
                                    src="https://res.skatekrak.com/static/skatekrak.com/Krakens/simon_low.jpg"
                                    alt="Kraken"
                                />
                            </li>
                            <li className="club-intro-content-kraken">
                                <img
                                    src="https://res.skatekrak.com/static/skatekrak.com/Krakens/felix_low.jpg"
                                    alt="Kraken"
                                />
                            </li>
                            <li className="club-intro-content-kraken">
                                <img
                                    src="https://res.skatekrak.com/static/skatekrak.com/Krakens/thomas_low.jpg"
                                    alt="Kraken"
                                />
                            </li>
                        </ul>
                        <p>
                            and 150+
                            <br />
                            other krakens
                        </p>
                    </div>
                    <div id="club-intro-content-anchors">
                        <a
                            onClick={() => this.handleAnchorScroll('#club-monthly')}
                            className="club-intro-content-anchor"
                        >
                            <div className="club-intro-content-anchor-title">
                                Monthly membership - 9{this.props.currency} / month <IconArrowHead />
                            </div>
                            <p>Join your tribe</p>
                        </a>
                        <a
                            onClick={() => this.handleAnchorScroll('#club-monthly')}
                            className="club-intro-content-anchor"
                        >
                            <div className="club-intro-content-anchor-title">
                                Quarterly plan - {this.props.pricing} / quarter <IconArrowHead />
                            </div>
                            <p>Your tribe + products at home</p>
                        </a>
                    </div>
                </div>
                <div id="club-intro-image" />
            </section>
        );
    }

    private handleAnchorScroll = (id: string) => {
        const scrollContainer = ScrollHelper.getScrollContainer();
        jump(id, {
            container: scrollContainer,
        });
    };
}

export default Intro;
