import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { reducer as formReducer } from 'redux-form';
import thunkMiddleware from 'redux-thunk';

const rootReducers = combineReducers({
    form: formReducer,
});

const store = createStore(rootReducers, composeWithDevTools(applyMiddleware(thunkMiddleware)));

export default store;
