import Link from 'next/link';
import React from 'react';

import NavItem from 'components/Header/NavItem';

/* tslint:disable:max-line-length */

/*
    We use this header for the map to let more space for the content
    It doesn't handle responsive and exist only for the desktop map.
    The display logic is in components/Layout.
    ps: Maybe we will extend the use to other pages
*/

const HeaderSmall = () => {
    return (
        <header id="header" className="header-small">
            <div id="header-nav-container">
                <nav id="header-nav-main">
                    <ul id="header-nav-main-container">
                        <NavItem title="Mag" url="/mag" />
                        <NavItem title="News" url="/news" />
                        <NavItem title="Video" url="/video" />
                        <NavItem title="Map" url="/map" />
                        <NavItem title="App" url="/app" />
                        <NavItem title="Shop" url="https://shop.skatekrak.com/" blank />
                    </ul>
                </nav>
                <nav id="header-nav-subnav">
                    <ul id="header-nav-subnav-container">
                        <li className="header-nav-subnav-item">
                            <a
                                href="https://www.facebook.com/skatekrak"
                                className="header-nav-subnav-item-link"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <svg
                                    className="icon-facebook-full"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 48 48"
                                >
                                    <title>FacebookFull</title>
                                    <g>
                                        <path d="M30,12.86l4.33,0,.05-7.48-.8-.11A46.61,46.61,0,0,0,28.51,5h-.09a9.14,9.14,0,0,0-6.55,2.4,9.52,9.52,0,0,0-2.62,7l0,3.82-5.55,0-.06,8.27,5.55,0-.12,16.5,8.48.06.12-16.5,5.43,0,1.13-8.27-6.49,0,0-3.18C27.74,13.55,28,12.82,30,12.86Z" />
                                    </g>
                                </svg>
                            </a>
                        </li>
                        <li className="header-nav-subnav-item">
                            <a
                                href="https://www.instagram.com/skate_krak/"
                                className="header-nav-subnav-item-link"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                    <title>Instagram</title>
                                    <g className="icon-instagram">
                                        <path
                                            className="icon-instagrem-shape"
                                            d="M30.21,44H17.79A13.76,13.76,0,0,1,4,30.21V17.79A13.76,13.76,0,0,1,17.79,4H30.21A13.76,13.76,0,0,1,44,17.79V30.21A13.76,13.76,0,0,1,30.21,44ZM17.79,6A11.76,11.76,0,0,0,6,17.79V30.21A11.76,11.76,0,0,0,17.79,42H30.21A11.76,11.76,0,0,0,42,30.21V17.79A11.76,11.76,0,0,0,30.21,6ZM24,33a9,9,0,1,1,9-9A9,9,0,0,1,24,33ZM24,17a7,7,0,1,0,7,7A7,7,0,0,0,24,17Zm10.35-.27a3.12,3.12,0,1,1,3.12-3.12A3.13,3.13,0,0,1,34.35,16.77Zm0-4.24a1.12,1.12,0,1,0,1.12,1.12A1.13,1.13,0,0,0,34.35,12.53Z"
                                        />
                                    </g>
                                </svg>
                            </a>
                        </li>
                        <li className="header-nav-subnav-item">
                            <a
                                href="https://www.youtube.com/krakskate"
                                className="header-nav-subnav-item-link"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 180">
                                    <path
                                        d="M253.3,38.8c0,0-2.5-17.6-10.2-25.4c-9.7-10.2-20.6-10.2-25.7-10.8C181.7,0,128,0,128,0H128
                                        c0,0-53.7,0-89.6,2.6c-5,0.6-15.9,0.6-25.7,10.8C5.1,21.2,2.6,38.8,2.6,38.8S0,59.6,0,80.3v19.4c0,20.7,2.6,41.4,2.6,41.4
                                        s2.5,17.6,10.2,25.4c9.7,10.2,22.5,9.9,28.2,10.9c20.5,2,87,2.6,87,2.6s53.8-0.1,89.6-2.7c5-0.6,15.9-0.6,25.7-10.8
                                        c7.7-7.8,10.2-25.4,10.2-25.4s2.6-20.7,2.6-41.4V80.3C255.9,59.6,253.3,38.8,253.3,38.8L253.3,38.8z M101.6,123.2V51.3l69.2,36.1
                                        L101.6,123.2L101.6,123.2z"
                                    />
                                </svg>
                            </a>
                        </li>
                        <li className="header-nav-subnav-item">
                            <a
                                href="https://twitter.com/skatekrak"
                                className="header-nav-subnav-item-link"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <svg className="icon-twitter" viewBox="0 0 256 209">
                                    <path d="M256,25.4500259 C246.580841,29.6272672 236.458451,32.4504868 225.834156,33.7202333 C236.678503,27.2198053 245.00583,16.9269929 248.927437,4.66307685 C238.779765,10.6812633 227.539325,15.0523376 215.57599,17.408298 C205.994835,7.2006971 192.34506,0.822 177.239197,0.822 C148.232605,0.822 124.716076,24.3375931 124.716076,53.3423116 C124.716076,57.4586875 125.181462,61.4673784 126.076652,65.3112644 C82.4258385,63.1210453 43.7257252,42.211429 17.821398,10.4359288 C13.3005011,18.1929938 10.710443,27.2151234 10.710443,36.8402889 C10.710443,55.061526 19.9835254,71.1374907 34.0762135,80.5557137 C25.4660961,80.2832239 17.3681846,77.9207088 10.2862577,73.9869292 C10.2825122,74.2060448 10.2825122,74.4260967 10.2825122,74.647085 C10.2825122,100.094453 28.3867003,121.322443 52.413563,126.14673 C48.0059695,127.347184 43.3661509,127.988612 38.5755734,127.988612 C35.1914554,127.988612 31.9009766,127.659938 28.694773,127.046602 C35.3777973,147.913145 54.7742053,163.097665 77.7569918,163.52185 C59.7820257,177.607983 37.1354036,186.004604 12.5289147,186.004604 C8.28987161,186.004604 4.10888474,185.75646 0,185.271409 C23.2431033,200.173139 50.8507261,208.867532 80.5109185,208.867532 C177.116529,208.867532 229.943977,128.836982 229.943977,59.4326002 C229.943977,57.1552968 229.893412,54.8901664 229.792282,52.6381454 C240.053257,45.2331635 248.958338,35.9825545 256,25.4500259" />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </nav>
                <div id="header-nav-credits">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 205.9 272.1">
                        <path d="M203.76,103.91v-1.39a101.28,101.28,0,1,0-202.56,0v1.39h0v59.46H67.47L1.2,208.8h0v62L5.37,268l96.14-64.32h1.25L199.59,268l4.31,2.78v-62l-67-45.43h67V103.91Z" />
                    </svg>
                    <p>© {new Date().getUTCFullYear()}</p>
                </div>
            </div>
        </header>
    );
};

export default HeaderSmall;
