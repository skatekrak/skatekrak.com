import React from 'react';

import Typography from 'components/Ui/typography/Typography';
import IconPlus from 'components/Ui/Icons/IconPlus';
import IconClear from 'components/Ui/Icons/IconClear';
import * as S from './MapCreateSpotMedia.styled';

type Props = {
    media: string[];
    handleAddMedia: (image: string) => void;
    handleRemoveMedia: (image: string) => void;
};

const MapCreateSpotMedia = ({ media, handleAddMedia, handleRemoveMedia }: Props) => {
    const hiddenMediaInput = React.useRef(null);

    const handleAddMediaClick = () => {
        hiddenMediaInput.current.click();
    };

    const handleMediaChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const fileName = evt.target.value;
        const idxDot = fileName.lastIndexOf('.') + 1;
        const extFile = fileName.substring(idxDot, fileName.length).toLowerCase();
        if (extFile === 'jpg' || extFile === 'jpeg' || extFile === 'png') {
            // TODO: how we temporaly store imgage to display in the media grid bellow?
            handleAddMedia(URL.createObjectURL(evt.target.files[0]));
        } else {
            alert('Only jpg/jpeg and png files are allowed!');
        }
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
                {media.map((image) => (
                    <S.MapCreateSpotMediaItemContainer key={image}>
                        <S.MapCreateSpotMediaRemoveButton onClick={() => handleRemoveMedia(image)}>
                            <IconClear />
                        </S.MapCreateSpotMediaRemoveButton>
                        <S.MapCreateSpotMediaItem image={image} />
                    </S.MapCreateSpotMediaItemContainer>
                ))}
            </S.MapCreateSpotMediaGrid>
        </S.MapCreateSpotMediaContainer>
    );
};

export default MapCreateSpotMedia;
