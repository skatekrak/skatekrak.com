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

        if (typeof window !== 'undefined' && state?.router) {
            nextState.router = state.router;
        }

        return nextState;
    } else {
        return reducers(state, action);
    }
};

export const initializeStore: MakeStore<Typings.RootState> = (context) => {
    const { asPath, pathname, query } = (context as AppContext).ctx || Router.router || {};
    let initialState;
    if (asPath) {
        const url = format({ pathname, query });
        initialState = {
            router: initialRouterState(url, asPath),
        };
    }

    const middlewares = [sagaMiddleware, routerMiddleware];
    const middlewareEnhancer = applyMiddleware(...middlewares);

    const composedEnhancers = composeWithDevTools(...[middlewareEnhancer]);

    const store = createStore(reducer, initialState, composedEnhancers);

    return store;
};

export const wrapper = createWrapper<Typings.RootState>(initializeStore);
