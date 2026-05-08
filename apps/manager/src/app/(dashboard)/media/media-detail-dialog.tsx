'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, formatDistanceToNow } from 'date-fns';
import { CalendarIcon, Image, MapPin, Pencil, User } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { ContractOutputs } from '@krak/contracts';
import {
    Badge,
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
    KrakImage,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Separator,
    Skeleton,
    Textarea,
} from '@krak/ui';

import { client, orpc } from '@/lib/orpc';

type Media = ContractOutputs['admin']['media']['list']['media'][number];

// ============================================================================
// Edit form schema
// ============================================================================

const editMediaSchema = z.object({
    caption: z.string(),
    releaseDate: z.date().nullable(),
    spotId: z.string(),
});

type EditMediaValues = z.infer<typeof editMediaSchema>;

// ============================================================================
// Dialog
// ============================================================================

export function MediaDetailDialog({
    mediaId,
    mediaList,
    onClose,
}: {
    mediaId: string | null;
    mediaList: Media[] | undefined;
    onClose: () => void;
}) {
    const [isEditing, setIsEditing] = useState(false);

    // Try to resolve from the current list first
    const listMedia = useMemo(
        () => (mediaId ? mediaList?.find((m) => m.id === mediaId) : undefined),
        [mediaId, mediaList],
    );

    // Fetch full media detail (needed for video URL, and as fallback when not in list)
    const { data: fullMedia } = useQuery({
        ...orpc.media.getById.queryOptions({ input: { id: mediaId ?? '' } }),
        enabled: mediaId != null,
    });

    // Use list data for basic fields, full data for video URL
    const media =
        listMedia ??
        (fullMedia
            ? {
                  id: fullMedia.id,
                  type: fullMedia.type.toUpperCase() as Media['type'],
                  caption: fullMedia.caption ?? null,
                  image: fullMedia.image ?? null,
                  spot: fullMedia.spot ? { id: fullMedia.spot.id, name: fullMedia.spot.name } : null,
                  addedBy: fullMedia.addedBy ? { username: fullMedia.addedBy.username } : null,
                  createdAt: fullMedia.createdAt,
              }
            : null);

    const videoUrl = fullMedia?.video?.url;

    function handleClose() {
        setIsEditing(false);
        onClose();
    }

    return (
        <Dialog open={mediaId != null} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0">
                {media && (
                    <>
                        {/* Media preview */}
                        <div className="relative bg-black">
                            {media.type === 'VIDEO' ? (
                                <MediaVideoPlayer videoUrl={videoUrl} image={media.image} />
                            ) : (
                                <MediaFullImage image={media.image} alt={media.caption || 'Media'} />
                            )}
                        </div>

                        {/* Info / Edit */}
                        {isEditing ? (
                            <MediaEditForm
                                media={media}
                                onCancel={() => setIsEditing(false)}
                                onSaved={() => setIsEditing(false)}
                            />
                        ) : (
                            <MediaInfoView
                                media={media}
                                fullMedia={fullMedia}
                                onEdit={() => setIsEditing(true)}
                                onClose={handleClose}
                            />
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

// ============================================================================
// View mode
// ============================================================================

type FullMedia = ContractOutputs['media']['getById'];

function MediaInfoView({
    media,
    fullMedia,
    onEdit,
    onClose,
}: {
    media: Media;
    fullMedia: FullMedia | undefined;
    onEdit: () => void;
    onClose: () => void;
}) {
    return (
        <div className="flex flex-col gap-4 p-6">
            <DialogHeader>
                <div className="flex items-center gap-2">
                    <DialogTitle className="flex-1">{media.caption || 'No caption'}</DialogTitle>
                    <Badge variant="outline">{media.type}</Badge>
                    <Button variant="ghost" size="icon" onClick={onEdit} className="size-8">
                        <Pencil className="size-4" />
                    </Button>
                </div>
                <DialogDescription className="sr-only">Media detail for {media.caption || media.id}</DialogDescription>
            </DialogHeader>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
                {media.spot && (
                    <div className="flex items-center gap-2">
                        <MapPin className="size-4 shrink-0 text-muted-foreground" />
                        <Link
                            href={`/spots/${media.spot.id}`}
                            className="truncate text-foreground hover:underline"
                            onClick={onClose}
                        >
                            {media.spot.name}
                        </Link>
                    </div>
                )}
                {media.addedBy && (
                    <div className="flex items-center gap-2">
                        <User className="size-4 shrink-0 text-muted-foreground" />
                        <Link
                            href={`/users/${media.addedBy.username}`}
                            className="truncate text-foreground hover:underline"
                            onClick={onClose}
                        >
                            {media.addedBy.username}
                        </Link>
                    </div>
                )}
            </div>

            {/* Extra fields from full media */}
            {fullMedia && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                    {fullMedia.caption && (
                        <div className="col-span-2">
                            <span className="text-xs text-muted-foreground">Caption</span>
                            <p className="text-sm">{fullMedia.caption}</p>
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{format(new Date(media.createdAt), 'PPP p')}</span>
                <span>({formatDistanceToNow(new Date(media.createdAt), { addSuffix: true })})</span>
            </div>

            <div className="text-xs text-muted-foreground">
                <span className="font-medium">ID:</span> {media.id}
            </div>
        </div>
    );
}

// ============================================================================
// Edit mode
// ============================================================================

function MediaEditForm({ media, onCancel, onSaved }: { media: Media; onCancel: () => void; onSaved: () => void }) {
    const queryClient = useQueryClient();

    const form = useForm<EditMediaValues>({
        resolver: zodResolver(editMediaSchema),
        defaultValues: {
            caption: media.caption ?? '',
            releaseDate: null,
            spotId: media.spot?.id ?? '',
        },
    });

    const mutation = useMutation({
        mutationFn: (values: EditMediaValues) => {
            return client.admin.media.update({
                id: media.id,
                caption: values.caption || null,
                releaseDate: values.releaseDate,
                spotId: values.spotId || null,
            });
        },
        onSuccess: () => {
            // Invalidate both the admin list and the public getById
            queryClient.invalidateQueries({
                queryKey: orpc.admin.media.list.queryOptions({ input: {} as never }).queryKey.slice(0, 2),
            });
            queryClient.invalidateQueries({
                queryKey: orpc.media.getById.queryOptions({ input: { id: media.id } }).queryKey,
            });
            onSaved();
        },
    });

    return (
        <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Edit Media</h3>
                <Button variant="ghost" size="sm" onClick={onCancel}>
                    Cancel
                </Button>
            </div>

            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="flex flex-col gap-4">
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
                                <FormLabel>Spot ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="Spot ID (leave empty to unlink)" {...field} />
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
                                <FormLabel>Release Date</FormLabel>
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
                            {mutation.error instanceof Error ? mutation.error.message : 'Failed to update media'}
                        </p>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

// ============================================================================
// Media preview components
// ============================================================================

function MediaVideoPlayer({ videoUrl, image }: { videoUrl: string | undefined; image: Media['image'] }) {
    if (!videoUrl) {
        return (
            <div className="relative flex aspect-video items-center justify-center bg-muted">
                {hasDisplayableImage(image) ? (
                    <>
                        <MediaFullImage image={image} alt="Video thumbnail" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Skeleton className="size-12 rounded-full" />
                        </div>
                    </>
                ) : (
                    <Skeleton className="size-12 rounded-full" />
                )}
            </div>
        );
    }

    return (
        <video controls autoPlay className="aspect-video w-full bg-black" preload="metadata">
            <source src={videoUrl} />
        </video>
    );
}

function MediaFullImage({ image, alt }: { image: Media['image']; alt: string }) {
    if (image == null) {
        return (
            <div className="flex aspect-video items-center justify-center bg-muted">
                <Image className="size-12 text-muted-foreground" />
            </div>
        );
    }
    if ('key' in image && image.key) {
        return (
            <KrakImage
                path={image.key}
                alt={alt}
                options={{ width: 800, height: 800, resizingType: 'fit', format: 'webp' }}
                className="w-full object-contain"
            />
        );
    }
    if ('url' in image && image.url) {
        return <img src={image.url} alt={alt} className="w-full object-contain" />;
    }
    return (
        <div className="flex aspect-video items-center justify-center bg-muted">
            <Image className="size-12 text-muted-foreground" />
        </div>
    );
}

function hasDisplayableImage(image: Media['image']): boolean {
    if (image == null) return false;
    if ('key' in image && image.key) return true;
    if ('url' in image && image.url) return true;
    return false;
}
