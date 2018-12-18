import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import news from './news';
import payment from './payment';

const reducers = combineReducers({
    form: formReducer,
    news,
    payment,
});

export default reducers;
