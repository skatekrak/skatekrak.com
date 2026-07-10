import { KrakImage } from '@krak/ui';

import Typography from '@/components/Ui/typography/Typography';

import type { MapHit } from '@/lib/meilisearch';

type Props = {
    map: MapHit;
    onMapClick: (map: MapHit) => void;
};

export default function MapSearchResultMap({ map, onMapClick }: Props) {
    return (
        <>
            <button
                className="relative flex items-center gap-2 w-full py-2.5 pl-2 pr-4 text-left"
                onClick={() => onMapClick(map)}
            >
                <KrakImage
                    path={`assets/maps/custom-maps/${map.id}.png`}
                    options={{ width: 36, height: 36, resizingType: 'fill' }}
                    alt={map.name}
                    className="block size-9 rounded-full border border-solid border-tertiary-light bg-tertiary-medium"
                />
                <div className="flex flex-col grow overflow-hidden">
                    <Typography
                        className="tracking-[0.2px] text-onDark-highEmphasis"
                        component="subtitle1"
                        truncateLines={1}
                        title={map.name}
                    >
                        {map.name}
                    </Typography>
                </div>
                {map.categories[0] && (
                    <Typography
                        className="mt-0.5 text-onDark-mediumEmphasis"
                        component="body2"
                        // truncateLines={1}
                    >
                        {map.categories[0]}
                    </Typography>
                )}
            </button>
            <div className="h-px bg-onDark-divider last-of-type:hidden" />
        </>
    );
}
