import client from './client';
import type { Media } from './types';

type ProgressEvent = {
    loaded: number;
    total: number;
    isTrusted: boolean;
    lengthComputable: boolean;
};

type CreateMediaParams = {
    caption?: string;
    spot?: string;
};

export const createMedia = async ({ caption, spot }: CreateMediaParams) => {
    const res = await client.post<Media>('/medias', {
        caption: caption === '' ? undefined : caption,
        spot,
    });

    return res.data;
};

export const uploadMedia = async (
    mediaId: string,
    uri: File,
    onUploadProgress?: (progressEvent: ProgressEvent) => void,
) => {
    const formData = new FormData();
    formData.append('file', uri);

    const res = await client.put<Media>(`/medias/${mediaId}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
    });

    return res.data;
};

const uriToBlob = (uri: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onerror = reject;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                resolve(xhr.response as Blob);
            }
        };
        xhr.open('GET', uri);
        xhr.responseType = 'blob';
        xhr.send();
    });
};
