import getConfig from 'next/config';
import React from 'react';

import Emoji from 'components/Ui/Icons/Emoji';
import IconSoldOut from 'components/Ui/Icons/SoldOut';
import VideoPlayer from 'components/Ui/Player/VideoPlayer';

type Props = {
    onOpenQuarterModal: () => void;
};

const Monthly = ({ onOpenQuarterModal }: Props) => {
    const quarterFull: boolean = getConfig().publicRuntimeConfig.IS_QUARTERFULL;
    return (
        <section id="club-quarterly">
            <h2 className="club-section-title">Quarterly membership</h2>
            <p className="club-section-subtitle">Limited quantities available</p>
            <p className="club-section-desc">
                Enjoy skateboarding more. We've been supporting independent <br />
                skate brands & artists around the world for the past 4 years.
                <br /> Shout out to all of them.
            </p>
            <div id="club-quarterly-main">
                <div id="club-quarterly-main-date-container">
                    {quarterFull ? (
                        <>
                            <IconSoldOut />
                            <p id="club-quarterly-main-date-title">Next batch starts on</p>
                        </>
                    ) : (
                        <>
                            <img
                                src="https://res.skatekrak.com/static/skatekrak.com/Club/spots-left.png"
                                alt="Krak skate club spots left"
                                id="club-quarterly-main-date-spot"
                            />
                            <p id="club-quarterly-main-date-spot-text">until</p>
                        </>
                    )}
                    <p id="club-quarterly-main-date">{getConfig().publicRuntimeConfig.NEXT_QUARTER_START}</p>
                    <button className="club-cta button-primary" onClick={onOpenQuarterModal}>
                        Save your spot
                    </button>
                </div>
                <div id="club-quarterly-main-benefits-container">
                    <p id="club-quarterly-main-benefits-desc">
                        Along a period of 3 months, you'll literally receive at home
                    </p>
                    <ul id="club-quarterly-main-benefits">
                        <li className="club-quarterly-main-benefit">an exclusive deck +</li>
                        <li className="club-quarterly-main-benefit">an exclusive T-shirt +</li>
                        <li className="club-quarterly-main-benefit">the one & only KrakBox +</li>
                        <li className="club-quarterly-main-benefit">everything from the monthly plan</li>
                    </ul>
                </div>
                <div id="club-quarterly-main-shipping-container">
                    <p id="club-quarterly-main-shipping-desc">
                        It’s damn simple. We put Santa Claus on a board all year long 🎄🎅🌴
                    </p>
                    <div id="club-quarterly-main-shipping-countries">
                        Only open for those countries:
                        <div id="club-quarterly-main-shipping-countries-flag">
                            <img
                                src="https://res.skatekrak.com/static/skatekrak.com/flags/united-states.svg"
                                alt="Flag"
                            />
                            <img src="https://res.skatekrak.com/static/skatekrak.com/flags/france.svg" alt="Flag" />
                            <img src="https://res.skatekrak.com/static/skatekrak.com/flags/germany.svg" alt="Flag" />
                            <img
                                src="https://res.skatekrak.com/static/skatekrak.com/flags/united-kingdom.svg"
                                alt="Flag"
                            />
                            <img src="https://res.skatekrak.com/static/skatekrak.com/flags/portugal.svg" alt="Flag" />
                            <img src="https://res.skatekrak.com/static/skatekrak.com/flags/belgium.svg" alt="Flag" />
                            <img
                                src="https://res.skatekrak.com/static/skatekrak.com/flags/netherlands.svg"
                                alt="Flag"
                            />
                        </div>
                        <p>
                            <Emoji symbol="🚚" label="Truck" /> Free shipping
                        </p>
                    </div>
                </div>
                <div id="club-quarterly-main-image1" />
                <div id="club-quarterly-main-image2" />
                <div id="club-quarterly-main-image3" />
            </div>
            <div id="club-quarterly-krakbox">
                <h3 id="club-quarterly-krakbox-title">What’s a KrakBox?</h3>
                <VideoPlayer url="https://www.youtube.com/watch?v=cdghhu3Yj8A" controls light playing />
            </div>
        </section>
    );
};

export default Monthly;
