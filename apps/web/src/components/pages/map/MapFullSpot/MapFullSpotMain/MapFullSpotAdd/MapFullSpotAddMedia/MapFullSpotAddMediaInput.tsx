import { useField } from 'formik';
import { useDropzone } from 'react-dropzone';

import IconClear from '@/components/Ui/Icons/IconClear';
import IconPlus from '@/components/Ui/Icons/IconPlus';
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
            <div className="relative max-w-full pt-[100%] my-8 rounded bg-tertiary-light overflow-hidden laptop-s:m-0 laptop-s:pt-0">
                <div className="absolute w-full top-0 bottom-0 left-0 hover:[&_svg]:fill-onDark-highEmphasis [&_svg]:m-auto [&_svg]:w-6 [&_svg]:fill-onDark-mediumEmphasis">
                    <button
                        className="absolute top-2 right-2 flex bg-tertiary-light rounded-full z-[1] [&_svg]:w-8 [&_svg]:fill-onDark-mediumEmphasis hover:[&_svg]:fill-onDark-highEmphasis"
                        onClick={removeMedia}
                    >
                        <IconClear />
                    </button>
                    {type.startsWith('image') && (
                        <img
                            className="relative w-full h-full object-cover m-auto bg-tertiary-dark"
                            src={url}
                        />
                    )}
                    {type.startsWith('video') && (
                        <video
                            className="relative w-full h-full object-cover m-auto bg-tertiary-dark"
                            src={url}
                            controls
                            autoPlay
                        />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative max-w-full pt-[100%] my-8 rounded bg-tertiary-light overflow-hidden laptop-s:m-0 laptop-s:pt-0"
            {...getRootProps()}
        >
            <button className="absolute w-full top-0 bottom-0 left-0 hover:[&_svg]:fill-onDark-highEmphasis [&_svg]:m-auto [&_svg]:w-6 [&_svg]:fill-onDark-mediumEmphasis">
                <IconPlus />
                <input type="file" accept=".jpg,.jpeg,.png" style={{ display: 'none' }} {...getInputProps()} />
            </button>
        </div>
    );
};

export default MapFullSpotAddMediaInput;
