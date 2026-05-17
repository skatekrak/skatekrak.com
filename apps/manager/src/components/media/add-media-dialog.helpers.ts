export type SelectedMediaFile = {
    id: string;
    file: File;
    preview: string | null;
    error?: string;
};

export type AddMediaUploadValues = {
    caption?: string;
    spotId?: string;
    releaseDate?: Date | null;
};

export type CreateAdminMediaInput = {
    file: File;
    caption?: string;
    spotId?: string;
    releaseDate?: Date;
};

type UploadSelectedMediaFilesInput = {
    files: SelectedMediaFile[];
    values: AddMediaUploadValues;
    createMedia: (input: CreateAdminMediaInput) => Promise<unknown>;
    onProgress?: (index: number) => void;
};

export type BatchUploadResult = {
    uploaded: number;
    failed: { id: string; name: string; message: string }[];
};

export async function uploadSelectedMediaFiles({
    files,
    values,
    createMedia,
    onProgress,
}: UploadSelectedMediaFilesInput): Promise<BatchUploadResult> {
    if (files.length === 0) throw new Error('No files selected');

    const failed: BatchUploadResult['failed'] = [];
    let uploaded = 0;

    for (const [index, selected] of files.entries()) {
        onProgress?.(index + 1);

        try {
            await createMedia({
                file: selected.file,
                caption: values.caption || undefined,
                spotId: values.spotId || undefined,
                releaseDate: values.releaseDate ?? undefined,
            });
            uploaded += 1;
        } catch (error) {
            failed.push({
                id: selected.id,
                name: selected.file.name,
                message: error instanceof Error ? error.message : 'Upload failed',
            });
        }
    }

    return { uploaded, failed };
}
