import Router from 'next/router';
import { AppContext } from 'next/app';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { createRouterMiddleware, initialRouterState, routerReducer } from 'connected-next-router';
import queryString from 'query-string';
import { save, load } from 'redux-localstorage-simple';
import merge from 'deepmerge';
import { combineReducers } from '@reduxjs/toolkit';
import { draw } from 'radash';

import querySyncMiddleware from './middleware/query-sync';

import mapReducer, { initialState as mapInitialState } from './map/slice';
import magReducer, { initialState as magInitialState } from './mag/slice';
import newsReducer, { initialState as newsInitialState } from './news/slice';
import videosReducer, { initialState as videosInitialState } from './videos/slice';
import settingsReducer from './settings/slice';
import { configureStore } from '@reduxjs/toolkit';
import cities from 'data/cities/_cities';
import { centerFromBounds } from 'lib/map/helpers';

const reducers = combineReducers({
    router: routerReducer,
    map: mapReducer,
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
            map: {
                ...mapInitialState,
                selectSpot: params.spot,
                modalVisible: params.modal === '1',
                customMapId: params.id,
                media: params.media,
            },
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

        // We don't go to a random city if a spot is selected, as well as a custom map
        if (params.spot == null && params.id == null) {
            const randomCity = draw(cities);

            state.map.viewport = {
                ...state.map.viewport,
                ...centerFromBounds(randomCity!.bounds),
            };
        }

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
        querySyncMiddleware,
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
export type RootState = Pick<ReturnType<typeof reducers>, 'mag' | 'map' | 'news' | 'router' | 'settings' | 'video'>;
export type AppDispatch = RootStore['dispatch'];

export const wrapper = createWrapper<RootStore>(initializeStore, {
    debug: process.env.NEXT_PUBLIC_STAGE === 'development',
});
