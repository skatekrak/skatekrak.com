import { AnyAction, applyMiddleware, createStore, Reducer } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import createSagaMiddleWare from 'redux-saga';
import { createWrapper, MakeStore } from 'next-redux-wrapper';
import Typings from 'Types';

import reducers from './reducers';

const sagaMiddleware = createSagaMiddleWare();

const reducer: Reducer<Typings.RootState, AnyAction> = (state, action) => {
    if (action.type === 'HYDRATE') {
        const nextState = {
            ...state,
            ...action.payload,
        };

        return nextState;
    } else {
        return reducers(state, action);
    }
};

export const initializeStore: MakeStore<Typings.RootState> = () => {
    const middlewares = [sagaMiddleware];
    const middlewareEnhancer = applyMiddleware(...middlewares);

    const composedEnhancers = composeWithDevTools(...[middlewareEnhancer]);

    const store = createStore(reducer, undefined, composedEnhancers);

    return store;
};

export const wrapper = createWrapper<Typings.RootState>(initializeStore);
