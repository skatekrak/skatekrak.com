import { combineReducers } from 'redux';

import news from './news/reducers';
import payment from './payment/reducers';
import settings from './settings/reducers';

export default () => combineReducers({ news, settings, payment });
