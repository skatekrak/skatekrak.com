import { combineReducers } from 'redux';

import auth from './auth/reducers';
import form from './form/reducers';
import news from './news/reducers';
import payment from './payment/reducers';
import settings from './settings/reducers';
import video from './video/reducers';

export default () => combineReducers({ auth, news, video, settings, payment, form });
