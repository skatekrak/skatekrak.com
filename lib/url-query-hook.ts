import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export function useRouterQuery(key: string, defaultValue?: string): string | undefined {
    const router = useRouter();
    const queryValue: string | undefined = router.query[key] === undefined ? undefined : String(router.query[key]);

    const [value, setValue] = useState(() => queryValue ?? defaultValue);

    useEffect(() => {
        setValue(queryValue);
    }, [queryValue]);

    return value;
}

export function useDispatchRouterQuery() {
    const router = useRouter();
    return (key: string, value?: string) => {
        const query = Object.assign({}, router.query);
        if (value == null) {
            delete query[key];
        } else {
            query[key] = value;
        }

        router.replace(
            {
                query,
            },
            undefined,
            { shallow: true },
        );
    };
}
