import jump from 'jump.js';
import React from 'react';

import IconArrowHead from 'components/Ui/Icons/ArrowHead';
import Emoji from 'components/Ui/Icons/Emoji';
import IconStartFull from 'components/Ui/Icons/StarFull';
import Image from 'components/Ui/Image';

import ScrollHelper from 'lib/ScrollHelper';

type Props = {
    pricingQuarter: string;
    pricingMonth: string;
};

class Intro extends React.PureComponent<Props, {}> {
    public render() {
        return (
            <section id="club-intro">
                <div id="club-intro-content">
                    <h2 id="club-intro-content-title">Never ride alone anymore</h2>
                    <p id="club-intro-content-desc">
                        Join a global community of international skateboarders exploring the streets.
                    </p>
                    <div id="club-intro-content-kraken">
                        <ul id="club-intro-content-kraken-images">
                            <li className="club-intro-content-kraken">
                                <Image
                                    retina
                                    src="https://res.skatekrak.com/static/skatekrak.com/Krakens/kev_low.jpg"
                                    alt="Kraken"
                                />
                            </li>
                            <li className="club-intro-content-kraken">
                                <Image
                                    retina
                                    src="https://res.skatekrak.com/static/skatekrak.com/Krakens/simon_low.jpg"
                                    alt="Kraken"
                                />
                            </li>
                            <li className="club-intro-content-kraken">
                                <Image
                                    retina
                                    src="https://res.skatekrak.com/static/skatekrak.com/Krakens/felix_low.jpg"
                                    alt="Kraken"
                                />
                            </li>
                            <li className="club-intro-content-kraken">
                                <Image
                                    retina
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
                            onClick={this.handleAnchorScroll}
                            className="club-intro-content-anchor"
                            data-anchor="#club-monthly"
                        >
                            <div className="club-intro-content-anchor-title">
                                Monthly membership - starts at {this.props.pricingMonth} / month <IconArrowHead />
                            </div>
                            <p>Join your tribe</p>
                        </a>
                        <a
                            onClick={this.handleAnchorScroll}
                            className="club-intro-content-anchor"
                            data-anchor="#club-quarterly"
                        >
                            <div className="club-intro-content-anchor-title">
                                <div>
                                    <Emoji symbol="📦" label="Box" /> Quarterly membership -{' '}
                                    <span className="club-intro-sold-out">
                                        <IconStartFull />
                                        Sold out
                                        <IconStartFull />
                                    </span>
                                </div>
                                <IconArrowHead />
                            </div>
                            <p>Join your tribe + receive products at home</p>
                        </a>
                    </div>
                </div>
                <div id="club-intro-image" />
            </section>
        );
    }

    private handleAnchorScroll = (evt: any) => {
        const scrollContainer = ScrollHelper.getScrollContainer();
        const scrollTarget = evt.currentTarget.getAttribute('data-anchor');
        jump(scrollTarget, {
            container: scrollContainer,
        });
    };
}

export default Intro;
