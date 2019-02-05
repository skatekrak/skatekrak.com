import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunkMiddleware from 'redux-thunk';

import reducers from './reducers';

export function initializeStore(initialState = {}) {
    return createStore(reducers(), initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)));
}
