import * as React from 'react';

import Layout from 'components/Layout/Layout';
import Page from 'components/pages/Page';

/* tslint:disable:max-line-length */
const Index: React.SFC<{}> = () => (
    <Page>
        <Layout>
            <React.Fragment>
                <div id="home-container">
                    <form id="home-newsletter">
                        <h2 id="home-newsletter-title">Get hooked up :</h2>
                        <input type="mail" id="home-newsletter-input" placeholder="love@skatekrak.com" />
                        <button id="home-newsletter-button">
                            Subscribe
                            <svg id="home-newsletter-button-icon" viewBox="0 0 48 48">
                                <title>Like</title>
                                <g className="icon-like">
                                    <path
                                        className="icon-like-stroke"
                                        d="M23.86,46,4.8,27.06A12.38,12.38,0,0,1,4.73,9.57a12.42,12.42,0,0,1,17.54.27l1.6,1.6L25.7,9.63A12.29,12.29,0,0,1,34.45,6h0a12.31,12.31,0,0,1,8.76,3.64,12.19,12.19,0,0,1-.29,17.42ZM9.48,28.67,23.86,43,41.4,25.53a10.06,10.06,0,0,0,.29-14.37,10.18,10.18,0,0,0-7.23-3h0a10.16,10.16,0,0,0-7.23,3ZM13.26,8.23a9.84,9.84,0,0,0-7,2.87,10.22,10.22,0,0,0,.07,14.44L8,27.15,22.34,13l-1.59-1.59A10.61,10.61,0,0,0,13.26,8.23Z"
                                    />
                                    <circle
                                        className="icon-like-hardware"
                                        cx="12.34"
                                        cy="19.9"
                                        r="1.04"
                                        transform="translate(-10.46 14.55) rotate(-45)"
                                    />
                                    <circle
                                        className="icon-like-hardware-2"
                                        data-name="like-hardware"
                                        cx="15.26"
                                        cy="16.97"
                                        r="1.04"
                                        transform="translate(-7.53 15.76) rotate(-45)"
                                    />
                                    <circle
                                        className="icon-like-hardware-3"
                                        data-name="like-hardware"
                                        cx="32.5"
                                        cy="16.97"
                                        r="1.04"
                                        transform="translate(-2.48 27.95) rotate(-45)"
                                    />
                                    <circle
                                        className="icon-like-hardware-4"
                                        data-name="like-hardware"
                                        cx="29.53"
                                        cy="19.94"
                                        r="1.04"
                                        transform="translate(-5.45 26.72) rotate(-45)"
                                    />
                                    <circle
                                        className="icon-like-hardware-5"
                                        data-name="like-hardware"
                                        cx="35.43"
                                        cy="19.9"
                                        r="1.04"
                                        transform="translate(-3.69 30.88) rotate(-45)"
                                    />
                                    <circle
                                        className="icon-like-hardware-6"
                                        data-name="like-hardware"
                                        cx="32.45"
                                        cy="22.87"
                                        r="1.04"
                                        transform="translate(-6.67 29.65) rotate(-45)"
                                    />
                                </g>
                            </svg>
                        </button>
                    </form>
                    <div id="home-image" />
                </div>
                <div id="quote-container">
                    <p
                        id="quote"
                        data-text="Skateboarding is not a hobby. And it's not a sport. Skateboarding is way of learning how to
                redefine the world around you. Ian Mackaye&nbsp;-&nbsp;"
                    >
                        Skateboarding is not a hobby. And it's not a sport. Skateboarding is way of learning how to
                        redefine the world around you. Ian Mackaye&nbsp;-&nbsp;
                    </p>
                </div>
            </React.Fragment>
        </Layout>
    </Page>
);

export default Index;
