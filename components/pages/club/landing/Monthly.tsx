import React from 'react';

const Monthly: React.SFC = () => (
    <section id="club-monthly">
        <h2 className="club-section-title">Monthly membership</h2>
        <p className="club-section-desc">
            We're building a club for passionate skateboarders. <br />
            We are driven by a desire to push you always more in the streets.
        </p>
        <div id="club-monthly-main-container">
            <div id="club-monthly-main">
                <h3 id="club-monthly-main-title">
                    Let's make the world <br />a huge playground!
                </h3>
                <p id="club-monthly-main-desc">
                    We deeply believe that we should all go out more and explore. Skateboarding day should run all year
                    long (at least).
                </p>
                <ul id="club-monthly-main-list">
                    <li className="club-monthly-main-list-item">
                        Geek out everything skate in our private network:{' '}
                        <a href="https://www.krakito.com/" target="_blank" rel="noreferrer noopener">
                            Krakito
                        </a>
                    </li>
                    <li className="club-monthly-main-list-item">Discover deals on skate goods & paraphernalia</li>
                    <li className="club-monthly-main-list-item">Digest exclusive interviews & workshops</li>
                    <li className="club-monthly-main-list-item">Benefit from thoughtful feedback & advice</li>
                    <li className="club-monthly-main-list-item">
                        Receive invites to secret events
                        <br />
                        (Paris, Brussels, Lisbon so far)
                    </li>
                    <li className="club-monthly-main-list-item">
                        Unlock special features on our mobile apps <br />
                        (Krak & Krak Session)
                    </li>
                </ul>
                <div id="club-monthly-main-app">
                    <div className="club-monthly-main-app-container" id="club-monthly-main-app-krakito">
                        <img
                            src="https://res.skatekrak.com/static/skatekrak.com/Icons/krakito.svg"
                            alt="Krakito"
                            className="club-monthly-main-app"
                        />
                    </div>
                    <div className="club-monthly-main-app-container" id="club-monthly-main-app-krakapp">
                        <img
                            src="https://res.skatekrak.com/static/skatekrak.com/Icons/krakapp.svg"
                            alt="Krak app"
                            className="club-monthly-main-app"
                        />
                    </div>
                    <div className="club-monthly-main-app-container" id="club-monthly-main-app-kraksession">
                        <img
                            src="https://res.skatekrak.com/static/skatekrak.com/Icons/kraksession.svg"
                            alt="Krak session"
                            id="club-monthly-main-app-kraksession"
                            className="club-monthly-main-app"
                        />
                    </div>
                </div>
            </div>
            <div id="club-monthly-sec">
                <div id="club-monthly-sec-image" />
                <div id="club-monthly-sec-skateistan">
                    <img
                        src="https://res.skatekrak.com/static/skatekrak.com/Icons/citizens-of-skateistan.svg"
                        alt=""
                        id="club-monthly-sec-skateistan-logo"
                    />
                    <p id="club-monthly-sec-skateistant-desc">
                        Let’s skate & do good at the same time. When you join us, 10% will go straight to{' '}
                        <a href="https://www.skateistan.org/" target="_blank" rel="noreferrer noopener">
                            Skateistan
                        </a>
                        .
                        <br />
                        Become a citizen too.
                    </p>
                </div>
                <a className="button-primary club-cta" href="https://www.krakito.com">
                    Join us
                </a>
            </div>
        </div>
    </section>
);

export default Monthly;
