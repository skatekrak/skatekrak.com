import React, { ElementRef, useRef } from 'react';

import Typography from 'components/Ui/typography/Typography';
import IconPlus from 'components/Ui/Icons/IconPlus';
import * as S from './MapCreateSpotMedia.styled';
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
        <S.MapCreateSpotMediaContainer>
            <Typography component="subtitle1">Media (1 minimum)</Typography>
            <S.MapCreateSpotMediaGrid>
                <S.MapCreateSpotMediaItemContainer>
                    <S.MapCreateSpotMediaItem>
                        <S.MapCreateSpotMediaAdd onClick={handleAddMediaClick}>
                            <IconPlus />
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                ref={hiddenMediaInput}
                                onChange={handleMediaChange}
                                style={{ display: 'none' }}
                            />
                        </S.MapCreateSpotMediaAdd>
                    </S.MapCreateSpotMediaItem>
                </S.MapCreateSpotMediaItemContainer>
                {value.map((image, index) => (
                    <MapCreateSpotMediaItem
                        key={`map-create-media-${index}`}
                        file={image}
                        onRemove={handleRemoveMedia}
                    />
                ))}
            </S.MapCreateSpotMediaGrid>
        </S.MapCreateSpotMediaContainer>
    );
};

export default MapCreateSpotMedia;
