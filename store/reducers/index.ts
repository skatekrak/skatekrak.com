import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import news from './news';
import payment from './payment';
import setting from './setting';

const reducers = combineReducers({
    form: formReducer,
    news,
    payment,
    setting,
});

export default reducers;
