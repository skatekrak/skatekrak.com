import { AnyAction, applyMiddleware, createStore, Reducer } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import createSagaMiddleWare from 'redux-saga';
import { createRouterMiddleware, initialRouterState } from 'connected-next-router';
import { createWrapper, MakeStore } from 'next-redux-wrapper';
import Typings from 'Types';

import reducers from './reducers';
import Router from 'next/router';
import { AppContext } from 'next/app';
import { format } from 'url';

const sagaMiddleware = createSagaMiddleWare();
const routerMiddleware = createRouterMiddleware();

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

export const initializeStore: MakeStore<Typings.RootState> = (context) => {
    let initialState;

    const middlewares = [sagaMiddleware];
    const middlewareEnhancer = applyMiddleware(...middlewares);

    const composedEnhancers = composeWithDevTools(...[middlewareEnhancer]);

    const store = createStore(reducer, initialState, composedEnhancers);

    return store;
};

export const wrapper = createWrapper<Typings.RootState>(initializeStore);
