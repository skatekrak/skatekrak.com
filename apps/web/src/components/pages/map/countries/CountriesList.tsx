import { useQuery } from '@tanstack/react-query';

import CountryImage from '@/components/pages/map/countries/CountryImage';
import { useCityID, useCountryID, useCustomMapID, useMediaID, useSpotID, useSpotModal } from '@/lib/hook/queryState';
import { orpc } from '@/server/orpc/client';
import { useMapStore } from '@/store/map';

export default function CountriesList({ onSelect }: { onSelect: () => void }) {
    const { data: countries = [], isPending, error, refetch } = useQuery(orpc.countries.list.queryOptions({}));
    const [countryId, setCountryID] = useCountryID();
    const [mapId, setCustomMapID] = useCustomMapID();
    const [, setCityID] = useCityID();
    const [, setSpotID] = useSpotID();
    const [, setSpotModal] = useSpotModal();
    const [, setMediaID] = useMediaID();

    return (
        <div className="flex flex-col gap-2 p-4 text-onDark-highEmphasis">
            {isPending && <p role="status">Loading countries...</p>}
            {error && (
                <div role="alert">
                    <p>Could not load countries.</p>
                    <button type="button" className="p-2 underline" onClick={() => refetch()}>
                        Try again
                    </button>
                </div>
            )}
            {!isPending && !error && countries.length === 0 && <p>No countries published yet.</p>}
            {countries.map((country) => (
                <button
                    key={country.id}
                    type="button"
                    aria-pressed={(countryId ?? mapId) === country.id}
                    className="flex w-full items-center gap-4 rounded-lg border border-onDark-divider p-3 text-left hover:border-onDark-placeholder focus-visible:outline focus-visible:outline-primary-100"
                    onClick={() => {
                        useMapStore.getState().toggleLegend(false);
                        useMapStore.getState().toggleSearchResult(false);
                        setCountryID(country.id);
                        setCustomMapID(null);
                        setCityID(null);
                        setSpotID(null);
                        setSpotModal(null);
                        setMediaID(null);
                        onSelect();
                    }}
                >
                    <CountryImage country={country} />
                    <span className="min-w-0 break-words font-medium">{country.name}</span>
                </button>
            ))}
        </div>
    );
}
