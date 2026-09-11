import type { Media } from '@krak/contracts';
import { cn, KrakImage } from '@krak/ui';

import MapSpotOverviewPlaceholder from '../MapSpotOverview/MapSpotOverviewPlaceholder';

export type MapSpotOverviewImageProps = {
    media?: Pick<Media, 'type' | 'image' | 'video'> | null;
    alt: string;
    className?: string;
    placeholderContainerClassName?: string;
};

export const MapSpotImage = ({ media, alt, className, placeholderContainerClassName }: MapSpotOverviewImageProps) => {
    const image = media?.image;

    return (
        <div className={cn('relative overflow-hidden bg-tertiary-medium aspect-video', className)}>
            {image && 'key' in image ? (
                <KrakImage
                    path={image.key}
                    options={{ width: 275, height: 183, resizingType: 'fill' }}
                    alt={alt}
                    className="absolute inset-0 size-full object-cover"
                />
            ) : media?.type === 'video' && media.video ? (
                <img
                    src={`https://res.cloudinary.com/krak/video/upload/w_275,ar_1.5,c_fill,dpr_auto/${media.video.publicId}.jpg`}
                    alt={alt}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover"
                />
            ) : (
                <div
                    className={cn(
                        'absolute inset-0 flex flex-col items-center justify-center',
                        placeholderContainerClassName,
                    )}
                >
                    <MapSpotOverviewPlaceholder className="w-2/3 [&>path]:fill-onDark-lowEmphasis" />
                </div>
            )}
        </div>
    );
};
