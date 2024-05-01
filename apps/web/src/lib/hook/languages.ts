import { useMemo } from 'react';
import { Language, Source } from 'rss-feed';

const useLanguages = (sources: Source[]) => {
    return useMemo(() => {
        if (sources != null) {
            const langs: Record<string, Language> = {};

            for (const el of sources) {
                if (langs[el.lang.isoCode] == null) {
                    langs[el.lang.isoCode] = el.lang;
                }
            }
            return Object.keys(langs).map((isoCode) => langs[isoCode]);
        }
        return [];
    }, [sources]);
};

export default useLanguages;
