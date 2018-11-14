import Router from 'next/router';
import React from 'react';

import analytics from 'lib/matomo';

import 'static/styles/checkout.styl';
import 'static/styles/club.styl';

import 'static/styles/checkbox.styl';

Router.events.on('routeChangeComplete', () => {
    analytics.trackPageView();
});

export default ({ children }) => <>{children}</>;
