import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import createSagaMiddleWare from 'redux-saga';

import rootSaga from '../saga';

import reducers from './reducers';

const sagaMiddleware = createSagaMiddleWare();

export function initializeStore(initialState = {}) {
    const middlewares = [sagaMiddleware];
    const middlewareEnhancer = applyMiddleware(...middlewares);

    const composedEnhancers = composeWithDevTools(...[middlewareEnhancer]);

    const store = createStore(reducers(), initialState, composedEnhancers);

    sagaMiddleware.run(rootSaga);

    return store;
}
