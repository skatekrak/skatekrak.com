import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import createSagaMiddleWare from 'redux-saga';
import { createWrapper } from 'next-redux-wrapper';
import Typings from 'Types';

import reducers from './reducers';

const sagaMiddleware = createSagaMiddleWare();

const reducer = (state, action) => {
    if (action.type === 'HYDRATE') {
        const nextState = {
            ...state,
            ...action.payload,
        };
        if (state.count) {
            nextState.count = state.count;
        }
        return nextState;
    } else {
        return reducers(state, action);
    }
};

export function initializeStore(initialState = {}) {
    const middlewares = [sagaMiddleware];
    const middlewareEnhancer = applyMiddleware(...middlewares);

    const composedEnhancers = composeWithDevTools(...[middlewareEnhancer]);

    const store = createStore(reducer, initialState, composedEnhancers);

    return store;
}

export const wrapper = createWrapper<Typings.RootState>(initializeStore);
