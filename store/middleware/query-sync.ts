import { replace } from 'connected-next-router';
import { Middleware } from 'redux';
import { omitBy, isUndefined } from 'lodash-es';
import queryString from 'query-string';

const querySyncMiddleware: Middleware = (store) => (next) => (action) => {
    if (action.meta != null && action.meta.pushToUrl) {
        const state = store.getState();

        const search = queryString.stringify(
            {
                ...queryString.parse(state.router.location.search),
                ...omitBy(action.meta.pushToUrl, isUndefined),
            },
            { skipNull: true, skipEmptyString: true },
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
