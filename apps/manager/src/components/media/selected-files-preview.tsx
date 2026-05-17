import { Film, Image, X } from 'lucide-react';

import { Button } from '@krak/ui';

import type { SelectedMediaFile } from './add-media-dialog.helpers';

type SelectedFilesPreviewProps = {
    files: SelectedMediaFile[];
    disabled: boolean;
    onRemove: (id: string) => void;
    onAddMore: () => void;
    onClear: () => void;
};

export function SelectedFilesPreview({ files, disabled, onRemove, onAddMore, onClear }: SelectedFilesPreviewProps) {
    const fileCountLabel = files.length === 1 ? '1 file selected' : `${files.length} files selected`;

    return (
        <div className="overflow-hidden rounded-lg border">
            <div className="flex items-start justify-between gap-3 border-b p-3">
                <div>
                    <p className="text-sm font-medium">{fileCountLabel}</p>
                    <p className="text-xs text-muted-foreground">
                        All uploads will share the same caption, spot, and release date.
                    </p>
                </div>
                <div className="flex shrink-0 gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={onAddMore} disabled={disabled}>
                        Add more
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={onClear} disabled={disabled}>
                        Clear all
                    </Button>
                </div>
            </div>
            <div className="max-h-64 divide-y overflow-y-auto">
                {files.map((file) => (
                    <SelectedFileRow key={file.id} file={file} disabled={disabled} onRemove={onRemove} />
                ))}
            </div>
        </div>
    );
}

function SelectedFileRow({
    file,
    disabled,
    onRemove,
}: {
    file: SelectedMediaFile;
    disabled: boolean;
    onRemove: (id: string) => void;
}) {
    const isVideo = file.file.type.startsWith('video/');

    return (
        <div className="flex items-center gap-3 p-3">
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                {file.preview ? (
                    <img src={file.preview} alt={file.file.name} className="size-full object-cover" />
                ) : isVideo ? (
                    <Film className="size-6 text-muted-foreground" />
                ) : (
                    <Image className="size-6 text-muted-foreground" />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.file.size)}</p>
                {file.error ? <p className="mt-1 text-xs text-destructive">{file.error}</p> : null}
            </div>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                onClick={() => onRemove(file.id)}
                disabled={disabled}
                aria-label={`Remove ${file.file.name}`}
            >
                <X className="size-4" />
            </Button>
        </div>
    );
}

function formatFileSize(size: number) {
    if (size < 1024) return `${size} B`;

    const kilobytes = size / 1024;
    if (kilobytes < 1024) {
        return `${kilobytes >= 100 ? kilobytes.toFixed(0) : kilobytes.toFixed(1)} KB`;
    }

    const megabytes = kilobytes / 1024;
    return `${megabytes >= 100 ? megabytes.toFixed(0) : megabytes.toFixed(1)} MB`;
}
