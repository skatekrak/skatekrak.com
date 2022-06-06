import React from 'react';

import Typography from 'components/Ui/typography/Typography';
import IconPlus from 'components/Ui/Icons/IconPlus';
import IconClear from 'components/Ui/Icons/IconClear';
import * as S from './MapCreateSpotMedia.styled';
import { useField } from 'formik';

const MapCreateSpotMedia = () => {
    const [{ value }, , helpers] = useField<string[]>('images');
    const hiddenMediaInput = React.useRef(null);

    const handleAddMediaClick = () => {
        hiddenMediaInput.current.click();
    };

    const handleMediaChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const fileName = evt.target.value;
        const idxDot = fileName.lastIndexOf('.') + 1;
        const extFile = fileName.substring(idxDot, fileName.length).toLowerCase();
        if (extFile === 'jpg' || extFile === 'jpeg' || extFile === 'png') {
            helpers.setValue(value.concat(URL.createObjectURL(evt.target.files[0])));
        } else {
            alert('Only jpg/jpeg and png files are allowed!');
        }
    };

    const handleRemoveMedia = (image: string) => {
        helpers.setValue(value.filter((url) => url !== image));
        URL.revokeObjectURL(image);
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
                {value.map((image) => (
                    <S.MapCreateSpotMediaItemContainer key={image}>
                        <S.MapCreateSpotMediaItem>
                            <S.MapCreateSpotMediaRemoveButton onClick={() => handleRemoveMedia(image)}>
                                <IconClear />
                            </S.MapCreateSpotMediaRemoveButton>
                            <S.MapCreateSpotMediaItemImage src={image} />
                        </S.MapCreateSpotMediaItem>
                    </S.MapCreateSpotMediaItemContainer>
                ))}
            </S.MapCreateSpotMediaGrid>
        </S.MapCreateSpotMediaContainer>
    );
};

export default MapCreateSpotMedia;
