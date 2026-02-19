import { useEffect, useState } from 'react';
import IconClear from '@/components/Ui/Icons/IconClear';

type MapCreateSpotMediaItemProps = {
    file: File;
    onRemove: (file: File) => void;
};

const MapCreateSpotMediaItem = ({ file, onRemove }: MapCreateSpotMediaItemProps) => {
    const [imageURL] = useState(() => URL.createObjectURL(file));
    useEffect(() => {
        return () => {
            URL.revokeObjectURL(imageURL);
        };
    }, []);

    return (
        <div className="relative pt-[100%] rounded bg-tertiary-light overflow-hidden" key={imageURL}>
            <div className="absolute top-0 right-0 bottom-0 left-0">
                <button
                    className="absolute top-2 right-2 flex bg-tertiary-light rounded-full z-[1] [&_svg]:w-8 [&_svg]:fill-onDark-mediumEmphasis hover:[&_svg]:fill-onDark-highEmphasis"
                    onClick={() => onRemove(file)}
                >
                    <IconClear />
                </button>
                <img className="relative w-full h-full object-cover bg-tertiary-light" src={imageURL} />
            </div>
        </div>
    );
};

export default MapCreateSpotMediaItem;
