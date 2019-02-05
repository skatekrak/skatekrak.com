import { combineReducers } from 'redux';

import news from './news';
import payment from './payment';
import setting from './setting';

const reducers = combineReducers({
    news,
    payment,
    setting,
});

export default reducers;
