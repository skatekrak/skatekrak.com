import { useField } from 'formik';
import React, { ElementRef, useRef, useState } from 'react';

import IconPlus from '@/components/Ui/Icons/IconPlus';
import Typography from '@/components/Ui/typography/Typography';

import MapCreateSpotMediaItem from './MapCreateSpotMediaItem';

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png']);

const MapCreateSpotMedia = () => {
    const [{ value }, , helpers] = useField<File[]>('images');
    const hiddenMediaInput = useRef<ElementRef<'input'> | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const handleAddMediaClick = () => {
        hiddenMediaInput.current?.click();
    };

    const handleMediaChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(evt.target.files ?? []);
        if (files.length === 0) return;

        const valid: File[] = [];
        let hasInvalid = false;

        for (const file of files) {
            const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
            if (ALLOWED_EXTENSIONS.has(ext)) {
                valid.push(file);
            } else {
                hasInvalid = true;
            }
        }

        if (hasInvalid) {
            setFileError('Only jpg/jpeg and png files are allowed');
        } else {
            setFileError(null);
        }

        if (valid.length > 0) {
            helpers.setValue(value.concat(valid));
        }

        evt.target.value = '';
    };

    const handleRemoveMedia = (image: File) => {
        helpers.setValue(value.filter((file) => file !== image));
    };

    return (
        <div className="p-6 tablet:px-8 tablet:py-5">
            <Typography component="subtitle1">Media (optional)</Typography>
            {value.length === 0 && (
                <Typography component="body2" className="mt-1 text-onDark-mediumEmphasis">
                    Add a photo to help skaters find this spot
                </Typography>
            )}
            {fileError && (
                <Typography component="body2" className="mt-1 text-red-400">
                    {fileError}
                </Typography>
            )}
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
                                multiple
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
