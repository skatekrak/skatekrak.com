import { useState } from 'react';

import type { Country } from '@krak/contracts';
import { getCountryFlagPath } from '@krak/utils';

export default function CountryImage({ country }: { country: Pick<Country, 'id' | 'code'> }) {
    const src = getCountryFlagPath(country.id, country.code);
    const [failedSource, setFailedSource] = useState<string | null>(null);
    return (
        <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-tertiary-light bg-tertiary-medium text-sm text-onDark-highEmphasis">
            {failedSource === src ? (
                country.code
            ) : (
                <img
                    src={src}
                    width={48}
                    height={48}
                    className="size-full object-cover"
                    alt=""
                    loading="lazy"
                    onError={() => setFailedSource(src)}
                />
            )}
        </span>
    );
}
