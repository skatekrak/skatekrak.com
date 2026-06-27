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
                className="relative flex items-center w-full py-2.5 pl-2 pr-4 text-left"
                onClick={() => onMapClick(map)}
            >
                <div className="flex items-center justify-center w-9 h-9 mr-2 rounded bg-tertiary-medium">
                    <span className="text-xs text-onDark-mediumEmphasis">MAP</span>
                </div>
                <div className="flex flex-col grow overflow-hidden">
                    <Typography
                        className="tracking-[0.2px] text-onDark-highEmphasis"
                        component="subtitle1"
                        truncateLines={1}
                    >
                        {map.name}
                    </Typography>
                    {map.categories[0] && (
                        <Typography
                            className="mt-0.5 italic text-onDark-lowEmphasis"
                            component="body2"
                            truncateLines={1}
                        >
                            {map.categories[0]}
                        </Typography>
                    )}
                </div>
            </button>
            <div className="h-px bg-onDark-divider last-of-type:hidden" />
        </>
    );
}
