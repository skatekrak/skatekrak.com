import { replace } from 'connected-next-router';
import { Middleware } from 'redux';
import queryString from 'query-string';

import Typings from 'Types';

const querySyncMiddleware: Middleware<unknown, Typings.RootState> = (store) => (next) => (action) => {
    if (action.meta != null && action.meta.pushToUrl) {
        const state = store.getState();

        const search = queryString.stringify(
            {
                ...queryString.parse(state.router.location.search),
                ...action.meta.pushToUrl,
            },
            { skipNull: true },
        );
        let url = state.router.location.pathname;

        if (search !== '') {
            url += '?' + search;
        }

        store.dispatch(replace(url, undefined, { shallow: true }));
    }

    return next(action);
};

export default querySyncMiddleware;