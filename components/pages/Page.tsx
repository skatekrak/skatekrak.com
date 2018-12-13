import Router from 'next/router';
import React from 'react';

import analytics from '@krak/analytics';
import getPageTitle from 'helpers/pageTitle';

import 'static/styles/checkout.styl';
import 'static/styles/club.styl';
import 'static/styles/news.styl';

import 'static/styles/checkbox.styl';
import 'static/styles/icons.styl';

Router.events.on('routeChangeComplete', (path) => {
    analytics.trackPageView(getPageTitle(path));
});

export default ({ children }) => <>{children}</>;
