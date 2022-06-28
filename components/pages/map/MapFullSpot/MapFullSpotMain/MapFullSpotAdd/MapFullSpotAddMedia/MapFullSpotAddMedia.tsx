import React, { useState } from 'react';
import Image from 'next/image';

import Typography from 'components/Ui/typography/Typography';
import IconPlus from 'components/Ui/Icons/IconPlus';
import IconClear from 'components/Ui/Icons/IconClear';
import * as S from './MapFullSpotAddMedia.styled';

const MapFullSpotAddMedia = () => {
    // const [{ value }, , helpers] = useField<File>('media');

    const [media, setMedia] = useState<string | undefined>(undefined);

    const handleAddMedia = (media: string) => {
        setMedia(media);
    };

    const handleRemoveMedia = () => {
        setMedia(undefined);
    };

    const hiddenMediaInput = React.useRef(null);

    const handleAddMediaClick = () => {
        hiddenMediaInput.current.click();
    };

    const handleMediaChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const fileName = evt.target.value;
        const idxDot = fileName.lastIndexOf('.') + 1;
        const extFile = fileName.substring(idxDot, fileName.length).toLowerCase();
        if (extFile === 'jpg' || extFile === 'jpeg' || extFile === 'png') {
            console.log(URL.createObjectURL(evt.target.files[0]));
            handleAddMedia(URL.createObjectURL(evt.target.files[0]));
        } else {
            alert('Only jpg/jpeg and png files are allowed!');
        }
    };

    const isLoading = false;

    const onSubmit = () => {
        console.log('submit');
    };

    return (
        <S.MapFullSpotAddMediaTabContainer>
            <S.MapFullSpotAddMediaTitle component="heading6">
                Attach an image or a video to this spot
            </S.MapFullSpotAddMediaTitle>
            <S.MapFullSpotAddMediaSubtitle component="body2">
                Image: jpeg, png, webP / Video: mp4
            </S.MapFullSpotAddMediaSubtitle>
            <S.MapFullSpotAddMediaGrid>
                {media ? (
                    <S.MapFullSpotAddMediaAddContainer>
                        <S.MapFullSpotAddMediaAdd as="div">
                            <S.MapFullSpotAddMediaRemoveButton onClick={handleRemoveMedia}>
                                <IconClear />
                            </S.MapFullSpotAddMediaRemoveButton>
                            <S.MapFullSpotAddMediaImage src={media} />
                        </S.MapFullSpotAddMediaAdd>
                    </S.MapFullSpotAddMediaAddContainer>
                ) : (
                    <S.MapFullSpotAddMediaAddContainer>
                        <S.MapFullSpotAddMediaAdd onClick={handleAddMediaClick}>
                            <IconPlus />
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                ref={hiddenMediaInput}
                                onChange={handleMediaChange}
                                style={{ display: 'none' }}
                            />
                        </S.MapFullSpotAddMediaAdd>
                    </S.MapFullSpotAddMediaAddContainer>
                )}
                <S.MapFullSpotAddMediaSecondaryColumn>
                    <Typography component="subtitle1">Add a caption</Typography>
                    <S.MapFullSpotAddMediaCaption placeholder="Your caption here" rows={6} />
                    <S.MapFullSpotAddMediaSubmitButton
                        onClick={onSubmit}
                        loading={isLoading}
                        disabled={media === undefined}
                    >
                        Add media
                    </S.MapFullSpotAddMediaSubmitButton>
                </S.MapFullSpotAddMediaSecondaryColumn>
            </S.MapFullSpotAddMediaGrid>
        </S.MapFullSpotAddMediaTabContainer>
    );
};

export default MapFullSpotAddMedia;
