import type { Country } from '@krak/contracts';
import { KrakImage } from '@krak/ui';

export default function CountryImage({ country }: { country: Pick<Country, 'id' | 'code'> }) {
    return (
        <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-tertiary-light bg-tertiary-medium text-sm text-onDark-highEmphasis">
            {country.code}
            <KrakImage
                path={`assets/maps/custom-maps/${country.id}.png`}
                options={{ width: 48, height: 48, resizingType: 'fill' }}
                className="absolute inset-0 size-full object-cover"
                alt=""
                onError={(event) => {
                    event.currentTarget.hidden = true;
                }}
            />
        </span>
    );
}
