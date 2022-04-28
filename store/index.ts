import Router from 'next/router';
import { AppContext } from 'next/app';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { createRouterMiddleware, initialRouterState, routerReducer } from 'connected-next-router';
import queryString from 'query-string';
import { ThunkAction } from 'redux-thunk';
import { save, load } from 'redux-localstorage-simple';
import merge from 'deepmerge';
import { Action } from 'redux';

import querySyncMiddleware from './middleware/query-sync';

import mapReducer, { initialState as mapInitialState } from './map/slice';
import magReducer, { initialState as magInitialState } from './mag/slice';
import newsReducer, { initialState as newsInitialState } from './news/slice';
import videosReducer, { initialState as videosInitialState } from './videos/slice';
import settingsReducer from './settings/slice';
import { configureStore, createSlice } from '@reduxjs/toolkit';

const subjectSlice = createSlice({
    name: 'subject',
    initialState: {} as any,

    reducers: {
        setEnt: (state, action) => {
            return action.payload;
        },
    },

    extraReducers: {
        [HYDRATE]: (state, action) => {
            const nextState = {
                ...state,
                ...action.payload.subject,
            };

            if (typeof window !== undefined && state?.router) {
                nextState.router = state.router;
            }

            return nextState;
        },
    },
});

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
        reducer: {
            router: routerReducer,
            map: mapReducer,
            mag: magReducer,
            news: newsReducer,
            video: videosReducer,
            settings: settingsReducer,
            [subjectSlice.name]: subjectSlice.reducer,
        },
        preloadedState: initialState,
        devTools: process.env.NEXT_PUBLIC_STAGE === 'development',
        middleware: middlewares,
    });

    return store;
};

export type RootStore = ReturnType<typeof initializeStore>;
export type RootState = ReturnType<RootStore['getState']>;
export type RootThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>;
export type AppDispatch = RootStore['dispatch'];

export const wrapper = createWrapper<RootStore>(initializeStore);
