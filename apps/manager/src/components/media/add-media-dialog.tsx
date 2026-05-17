'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, Upload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
    Button,
    Calendar,
    cn,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Separator,
    Textarea,
    toast,
} from '@krak/ui';

import { client, orpc } from '@/lib/orpc';

import { uploadSelectedMediaFiles, type SelectedMediaFile } from './add-media-dialog.helpers';
import { SelectedFilesPreview } from './selected-files-preview';

// ============================================================================
// Form schema
// ============================================================================

const addMediaSchema = z.object({
    caption: z.string().optional(),
    spotId: z.string().optional(),
    releaseDate: z.date().nullable(),
});

type AddMediaValues = z.infer<typeof addMediaSchema>;

// ============================================================================
// Accepted file types
// ============================================================================

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];

const ACCEPT_STRING = ACCEPTED_TYPES.join(',');

function isAcceptedType(type: string) {
    return ACCEPTED_TYPES.includes(type);
}

function createSelectedMediaFile(file: File): SelectedMediaFile {
    return {
        id: globalThis.crypto.randomUUID(),
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    };
}

function revokeSelectedFile(file: SelectedMediaFile) {
    if (file.preview) URL.revokeObjectURL(file.preview);
}

// ============================================================================
// Dialog
// ============================================================================

export function AddMediaDialog({
    open,
    onOpenChange,
    defaultSpotId,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultSpotId?: string;
}) {
    const queryClient = useQueryClient();
    const [files, setFiles] = useState<SelectedMediaFile[]>([]);
    const [uploadIndex, setUploadIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<AddMediaValues>({
        resolver: zodResolver(addMediaSchema),
        defaultValues: {
            caption: '',
            spotId: defaultSpotId ?? '',
            releaseDate: null,
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: AddMediaValues) => {
            return uploadSelectedMediaFiles({
                files,
                values,
                createMedia: (input) => client.admin.media.create(input),
                onProgress: setUploadIndex,
            });
        },
    });

    const uploadLabel = mutation.isPending
        ? `Uploading ${uploadIndex ?? 1}/${files.length}`
        : files.length === 0
          ? 'Upload'
          : files.length === 1
            ? 'Upload 1 file'
            : `Upload ${files.length} files`;

    function resetDialog() {
        setFiles((current) => {
            current.forEach(revokeSelectedFile);
            return [];
        });
        setUploadIndex(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        form.reset();
        mutation.reset();
    }

    function handleClose() {
        if (mutation.isPending) return;
        resetDialog();
        onOpenChange(false);
    }

    function handleSubmit(values: AddMediaValues) {
        mutation.mutate(values, {
            onSuccess: (result) => {
                setUploadIndex(null);

                if (result.uploaded > 0) {
                    queryClient.invalidateQueries({
                        queryKey: orpc.admin.media.list.queryOptions({ input: {} as never }).queryKey.slice(0, 2),
                    });
                }

                if (result.failed.length === 0) {
                    toast.success(
                        result.uploaded === 1
                            ? 'Media uploaded successfully'
                            : `${result.uploaded} media uploaded successfully`,
                    );
                    resetDialog();
                    onOpenChange(false);
                    return;
                }

                const failedMessages = new Map(result.failed.map((failed) => [failed.id, failed.message]));

                setFiles((current) => {
                    current.filter((item) => !failedMessages.has(item.id)).forEach(revokeSelectedFile);
                    return current
                        .filter((item) => failedMessages.has(item.id))
                        .map((item) => ({
                            ...item,
                            error: failedMessages.get(item.id),
                        }));
                });

                if (result.uploaded > 0) {
                    toast.warning(`${result.uploaded} uploaded, ${result.failed.length} failed`);
                } else {
                    toast.error('No media uploaded. Fix the failed files and retry.');
                }
            },
        });
    }

    const handleFiles = useCallback((newFiles: File[]) => {
        const accepted = newFiles.filter((newFile) => isAcceptedType(newFile.type));
        const rejected = newFiles.length - accepted.length;

        if (rejected > 0) {
            toast.error(`${rejected} unsupported file${rejected === 1 ? '' : 's'} skipped`);
        }

        if (accepted.length === 0) return;

        setFiles((current) => [...current, ...accepted.map(createSelectedMediaFile)]);
    }, []);

    const handleFileInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const selected = Array.from(event.target.files ?? []);
            if (selected.length > 0) handleFiles(selected);
            event.target.value = '';
        },
        [handleFiles],
    );

    function removeFile(id: string) {
        setFiles((current) => {
            const removed = current.find((item) => item.id === id);
            if (removed) revokeSelectedFile(removed);
            return current.filter((item) => item.id !== id);
        });
    }

    function clearFiles() {
        setFiles((current) => {
            current.forEach(revokeSelectedFile);
            return [];
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    return (
        <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
            <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add media</DialogTitle>
                    <DialogDescription>Upload one or more images or videos.</DialogDescription>
                </DialogHeader>

                <Separator />

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPT_STRING}
                    multiple
                    className="hidden"
                    onChange={handleFileInputChange}
                    disabled={mutation.isPending}
                />

                {/* Dropzone / Preview */}
                {files.length > 0 ? (
                    <SelectedFilesPreview
                        files={files}
                        disabled={mutation.isPending}
                        onRemove={removeFile}
                        onAddMore={() => fileInputRef.current?.click()}
                        onClear={clearFiles}
                    />
                ) : (
                    <DropZone onFiles={handleFiles} fileInputRef={fileInputRef} disabled={mutation.isPending} />
                )}

                {/* Form fields */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="caption"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Caption</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Media caption..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="spotId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Spot ID {defaultSpotId ? '' : '(optional)'}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Spot ID to link media to"
                                            {...field}
                                            readOnly={!!defaultSpotId}
                                            className={defaultSpotId ? 'bg-muted' : ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="releaseDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Release Date (optional)</FormLabel>
                                    <div className="flex items-center gap-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            'w-full justify-start text-left font-normal',
                                                            !field.value && 'text-muted-foreground',
                                                        )}
                                                    >
                                                        <CalendarIcon className="size-4" />
                                                        {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ?? undefined}
                                                    onSelect={(date) => field.onChange(date ?? null)}
                                                    captionLayout="dropdown"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {field.value && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => form.setValue('releaseDate', null)}
                                            >
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {mutation.error && !mutation.isPending && (
                            <p className="text-sm text-destructive">
                                {mutation.error instanceof Error ? mutation.error.message : 'Failed to upload media'}
                            </p>
                        )}

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={handleClose} disabled={mutation.isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={files.length === 0 || mutation.isPending}>
                                {uploadLabel}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

// ============================================================================
// Drop zone
// ============================================================================

function DropZone({
    onFiles,
    fileInputRef,
    disabled,
}: {
    onFiles: (files: File[]) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    disabled: boolean;
}) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (disabled) return;
            setIsDragging(true);
        },
        [disabled],
    );

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            if (disabled) return;

            const droppedFiles = Array.from(e.dataTransfer.files);
            if (droppedFiles.length > 0) onFiles(droppedFiles);
        },
        [disabled, onFiles],
    );

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
            className={cn(
                'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors',
                disabled && 'cursor-not-allowed opacity-60',
                isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50',
            )}
        >
            <Upload className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium">Drag & drop files here, or click to browse</p>
            <p className="text-xs text-muted-foreground">Images (PNG, JPEG, WebP) or Videos (MP4, WebM, MOV)</p>
        </div>
    );
}
