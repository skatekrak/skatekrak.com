import { replace } from 'connected-next-router';
import { Middleware } from 'redux';
import { shake } from 'radash';
import queryString from 'query-string';

const querySyncMiddleware: Middleware = (store) => (next) => (action) => {
    if (action.meta != null && action.meta.pushToUrl) {
        const state = store.getState();

        const search = queryString.stringify(
            {
                ...queryString.parse(state.router.location.search),
                ...shake(action.meta.pushToUrl),
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
