import { useMemo } from 'react';
import { Language } from 'rss-feed';
import useNewsSources from './sources';

const useNewsLanguages = () => {
    const { data, ...props } = useNewsSources();

    const languages = useMemo(() => {
        if (data != null) {
            const langs: Record<string, Language> = {};

            for (const el of data) {
                if (langs[el.lang.isoCode] == null) {
                    langs[el.lang.isoCode] = el.lang;
                }
            }
            return Object.keys(langs).map((isoCode) => langs[isoCode]);
        }
        return [];
    }, [data]);

    return {
        ...props,
        data: data == null ? null : languages,
    };
};

export default useNewsLanguages;
