import { useField } from 'formik';
import { useDropzone } from 'react-dropzone';

import IconClear from '@/components/Ui/Icons/IconClear';
import IconPlus from '@/components/Ui/Icons/IconPlus';
import * as S from './MapFullSpotAddMedia.styled';
import { useCallback, useMemo, useState } from 'react';

const MapFullSpotAddMediaInput = () => {
    const [file, , helpers] = useField<File | null>('file');
    const [type, setType] = useState('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        helpers.setValue(acceptedFiles[0]);
        setType(acceptedFiles[0].type);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'video/webm': ['.webm'],
            'video/mp4': ['.mp4'],
            'video/quicktime': ['.mov'],
        },
    });

    const url = useMemo(() => {
        if (file.value == null) {
            return '';
        }
        return URL.createObjectURL(file.value);
    }, [file.value]);

    const removeMedia = () => {
        URL.revokeObjectURL(url);
        helpers.setValue(null);
    };

    if (file.value != null) {
        return (
            <S.MapFullSpotAddMediaAddContainer>
                <S.MapFullSpotAddMediaAdd as="div">
                    <S.MapFullSpotAddMediaRemoveButton onClick={removeMedia}>
                        <IconClear />
                    </S.MapFullSpotAddMediaRemoveButton>
                    {type.startsWith('image') && <S.MapFullSpotAddMediaImage src={url} />}
                    {type.startsWith('video') && <S.MapFullSpotAddMediaVideo src={url} controls autoPlay />}
                </S.MapFullSpotAddMediaAdd>
            </S.MapFullSpotAddMediaAddContainer>
        );
    }

    return (
        <S.MapFullSpotAddMediaAddContainer {...getRootProps()}>
            <S.MapFullSpotAddMediaAdd>
                <IconPlus />
                <input type="file" accept=".jpg,.jpeg,.png" style={{ display: 'none' }} {...getInputProps()} />
            </S.MapFullSpotAddMediaAdd>
        </S.MapFullSpotAddMediaAddContainer>
    );
};

export default MapFullSpotAddMediaInput;
