import { AnyAction, applyMiddleware, createStore, Reducer } from 'redux';
import Router from 'next/router';
import { format } from 'url';
import { AppContext } from 'next/app';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import createSagaMiddleWare from 'redux-saga';
import { createWrapper, MakeStore } from 'next-redux-wrapper';
import { createRouterMiddleware, initialRouterState } from 'connected-next-router';
import queryString from 'query-string';

import Typings from 'Types';

import reducers from './reducers';
import querySyncMiddleware from './middleware/query-sync';

import { initialState as mapInitialState } from './map/reducers';

const reducer: Reducer<Typings.RootState, AnyAction> = (state, action) => {
    if (action.type === 'HYDRATE') {
        const nextState = {
            ...state,
            ...action.payload,
        };

        if (typeof window !== undefined && state?.router) {
            nextState.router = state.router;
        }

        return nextState;
    } else {
        return reducers(state, action);
    }
};

export const initializeStore: MakeStore<Typings.RootState> = (context) => {
    const sagaMiddleware = createSagaMiddleWare();
    const routerMiddleware = createRouterMiddleware();

    const { asPath, pathname, query } = (context as AppContext).ctx || Router.router || {};

    let initialState;
    if (asPath) {
        const url = format({ pathname, query });
        const initialRouter = initialRouterState(url, asPath);
        const params = queryString.parse(initialRouter.location.search);

        initialState = {
            router: initialRouter,
            map: {
                ...mapInitialState,
                selectSpot: params.spot,
                modalVisible: params.modal === '1',
            },
        };
    }

    const middlewares = [sagaMiddleware, routerMiddleware, querySyncMiddleware];
    const middlewareEnhancer = applyMiddleware(...middlewares);

    const composedEnhancers = composeWithDevTools(...[middlewareEnhancer]);

    const store = createStore(reducer, initialState, composedEnhancers);

    return store;
};

export const wrapper = createWrapper<Typings.RootState>(initializeStore);
