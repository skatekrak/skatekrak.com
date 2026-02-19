import React, { ElementRef, useRef } from 'react';

import Typography from '@/components/Ui/typography/Typography';
import IconPlus from '@/components/Ui/Icons/IconPlus';
import { useField } from 'formik';
import MapCreateSpotMediaItem from './MapCreateSpotMediaItem';

const MapCreateSpotMedia = () => {
    const [{ value }, , helpers] = useField<File[]>('images');
    const hiddenMediaInput = useRef<ElementRef<'input'> | null>(null);

    const handleAddMediaClick = () => {
        hiddenMediaInput.current?.click();
    };

    const handleMediaChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const fileName = evt.target.value;
        const idxDot = fileName.lastIndexOf('.') + 1;
        const extFile = fileName.substring(idxDot, fileName.length).toLowerCase();
        if (extFile === 'jpg' || extFile === 'jpeg' || extFile === 'png') {
            const item = evt.target.files?.item(0);
            if (item == null) return;
            helpers.setValue(value.concat(item));
        } else {
            alert('Only jpg/jpeg and png files are allowed!');
        }
    };

    const handleRemoveMedia = (image: File) => {
        helpers.setValue(value.filter((file) => file !== image));
    };

    return (
        <div className="p-6 tablet:px-8 tablet:py-5">
            <Typography component="subtitle1">Media (1 minimum)</Typography>
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="relative pt-[100%] rounded bg-tertiary-light overflow-hidden">
                    <div className="absolute top-0 right-0 bottom-0 left-0">
                        <button
                            className="flex w-full h-full hover:[&_svg]:fill-onDark-highEmphasis [&_svg]:m-auto [&_svg]:w-6 [&_svg]:fill-onDark-mediumEmphasis"
                            onClick={handleAddMediaClick}
                        >
                            <IconPlus />
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                ref={hiddenMediaInput}
                                onChange={handleMediaChange}
                                style={{ display: 'none' }}
                            />
                        </button>
                    </div>
                </div>
                {value.map((image, index) => (
                    <MapCreateSpotMediaItem
                        key={`map-create-media-${index}`}
                        file={image}
                        onRemove={handleRemoveMedia}
                    />
                ))}
            </div>
        </div>
    );
};

export default MapCreateSpotMedia;
