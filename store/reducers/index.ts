import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import payment from './payment';

const reducers = combineReducers({
    form: formReducer,
    payment,
});

export default reducers;
