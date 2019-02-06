import { combineReducers } from 'redux';

import auth from './auth/reducers';
import news from './news/reducers';
import payment from './payment/reducers';
import settings from './settings/reducers';

export default () => combineReducers({ auth, news, settings, payment });
