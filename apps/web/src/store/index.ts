import Router from 'next/router';
import { AppContext } from 'next/app';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { createRouterMiddleware, initialRouterState, routerReducer } from 'connected-next-router';
import queryString from 'query-string';
import { save, load } from 'redux-localstorage-simple';
import merge from 'deepmerge';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import magReducer, { initialState as magInitialState } from './mag/slice';
import newsReducer, { initialState as newsInitialState } from './news/slice';
import videosReducer, { initialState as videosInitialState } from './videos/slice';
import settingsReducer from './settings/slice';

const reducers = combineReducers({
    router: routerReducer,
    mag: magReducer,
    news: newsReducer,
    video: videosReducer,
    settings: settingsReducer,
});

const reducer = (state, action) => {
    if (action.type === HYDRATE) {
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

export const initializeStore = (context) => {
    const routerMiddleware = createRouterMiddleware();

    const { asPath } = (context as AppContext).ctx || Router.router || {};

    let initialState;
    if (asPath) {
        const initialRouter = initialRouterState(asPath);
        const params = queryString.parse(initialRouter.location.search);

        const state = {
            router: initialRouter,
            mag: {
                ...magInitialState,
                search: params.query ?? '',
            },
            news: {
                ...newsInitialState,
                search: params.query ?? '',
            },
            video: {
                ...videosInitialState,
                search: params.query ?? '',
            },
        };

        initialState = merge(
            state,
            load({
                states: ['mag', 'news', 'videos'],
                namespace: 'skatekrak',
            }),
        );
    }

    const middlewares = [
        routerMiddleware,
        save({ states: ['news', 'mag', 'videos'], debounce: 500, namespace: 'skatekrak' }),
    ];

    const store = configureStore({
        reducer,
        preloadedState: initialState,
        devTools: process.env.NEXT_PUBLIC_STAGE === 'development',
        middleware: middlewares,
    });

    return store;
};

export type RootStore = ReturnType<typeof initializeStore>;
export type RootState = Pick<ReturnType<typeof reducers>, 'mag' | 'news' | 'router' | 'settings' | 'video'>;
export type AppDispatch = RootStore['dispatch'];

export const wrapper = createWrapper<RootStore>(initializeStore, {
    debug: process.env.NEXT_PUBLIC_STAGE === 'development',
});
