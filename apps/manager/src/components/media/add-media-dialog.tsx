'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, Film, Image, Upload, X } from 'lucide-react';
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
} from '@krak/ui';

import { client, orpc } from '@/lib/orpc';

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
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
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
            if (!file) throw new Error('No file selected');

            return client.admin.media.create({
                file,
                caption: values.caption || undefined,
                spotId: values.spotId || undefined,
                releaseDate: values.releaseDate ?? undefined,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: orpc.admin.media.list.queryOptions({ input: {} as never }).queryKey.slice(0, 2),
            });
            handleClose();
        },
    });

    function handleClose() {
        if (mutation.isPending) return;
        setFile(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        form.reset();
        mutation.reset();
        onOpenChange(false);
    }

    function handleFile(newFile: File) {
        if (!isAcceptedType(newFile.type)) return;
        if (preview) URL.revokeObjectURL(preview);
        setFile(newFile);
        if (newFile.type.startsWith('image/')) {
            setPreview(URL.createObjectURL(newFile));
        } else {
            setPreview(null);
        }
    }

    function clearFile() {
        if (preview) URL.revokeObjectURL(preview);
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    return (
        <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add media</DialogTitle>
                    <DialogDescription>Upload an image or video.</DialogDescription>
                </DialogHeader>

                <Separator />

                {/* Dropzone / Preview */}
                {file ? (
                    <FilePreview file={file} preview={preview} onClear={clearFile} />
                ) : (
                    <DropZone onFile={handleFile} fileInputRef={fileInputRef} />
                )}

                {/* Form fields */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
                        className="flex flex-col gap-4"
                    >
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

                        {mutation.error && (
                            <p className="text-sm text-destructive">
                                {mutation.error instanceof Error ? mutation.error.message : 'Failed to upload media'}
                            </p>
                        )}

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={handleClose} disabled={mutation.isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={!file || mutation.isPending}>
                                {mutation.isPending ? 'Uploading...' : 'Upload'}
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
    onFile,
    fileInputRef,
}: {
    onFile: (file: File) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
}) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

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

            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) onFile(droppedFile);
        },
        [onFile],
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selected = e.target.files?.[0];
            if (selected) onFile(selected);
        },
        [onFile],
    );

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
                'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors',
                isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50',
            )}
        >
            <Upload className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium">Drag & drop a file here, or click to browse</p>
            <p className="text-xs text-muted-foreground">Images (PNG, JPEG, WebP) or Videos (MP4, WebM, MOV)</p>
            <input ref={fileInputRef} type="file" accept={ACCEPT_STRING} className="hidden" onChange={handleChange} />
        </div>
    );
}

// ============================================================================
// File preview
// ============================================================================

function FilePreview({ file, preview, onClear }: { file: File; preview: string | null; onClear: () => void }) {
    const isVideo = file.type.startsWith('video/');

    return (
        <div className="relative overflow-hidden rounded-lg border bg-muted">
            <div className="flex aspect-video items-center justify-center">
                {preview ? (
                    <img src={preview} alt="Preview" className="size-full object-contain" />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        {isVideo ? <Film className="size-10" /> : <Image className="size-10" />}
                        <span className="text-sm">{file.name}</span>
                    </div>
                )}
            </div>
            <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 size-7"
                onClick={onClear}
            >
                <X className="size-4" />
            </Button>
        </div>
    );
}
