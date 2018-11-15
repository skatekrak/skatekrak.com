import Router from 'next/router';
import React from 'react';

import analytics from 'lib/matomo';

import 'static/styles/checkout.styl';
import 'static/styles/club.styl';

import 'static/styles/checkbox.styl';

Router.events.on('routeChangeComplete', (url) => {
    let name = '';
    switch (url) {
        case '/club':
            name = 'Club';
            break;
        case '/club/subscribe':
            name = 'Subscribe';
            break;
        case '/club/congrats':
            name = 'Congrats';
            break;
        case '/':
            name = 'Homepage';
            break;
        default:
            break;
    }
    console.log(url, name);
    analytics.trackPageView(name);
});

export default ({ children }) => <>{children}</>;
