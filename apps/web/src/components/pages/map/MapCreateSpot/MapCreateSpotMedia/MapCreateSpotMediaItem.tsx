import { useEffect, useState } from 'react';
import IconClear from '@/components/Ui/Icons/IconClear';
import * as S from './MapCreateSpotMedia.styled';
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
        <S.MapCreateSpotMediaItemContainer key={imageURL}>
            <S.MapCreateSpotMediaItem>
                <S.MapCreateSpotMediaRemoveButton onClick={() => onRemove(file)}>
                    <IconClear />
                </S.MapCreateSpotMediaRemoveButton>
                <S.MapCreateSpotMediaItemImage src={imageURL} />
            </S.MapCreateSpotMediaItem>
        </S.MapCreateSpotMediaItemContainer>
    );
};

export default MapCreateSpotMediaItem;
