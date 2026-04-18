'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ExternalLink, Facebook, Ghost, Globe, Instagram, MapPin, Pencil, Phone } from 'lucide-react';
import { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { ContractOutputs } from '@krak/contracts';
import { AdminSpotStatusSchema, AdminSpotTypeSchema } from '@krak/contracts';
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Separator,
    Skeleton,
    Switch,
    Textarea,
} from '@krak/ui';

import { client, orpc } from '@/lib/orpc';

type SpotOverview = ContractOutputs['spots']['getSpotOverview'];
type Spot = SpotOverview['spot'];

// ============================================================================
// Edit form schema
// ============================================================================

const editGeneralInfoSchema = z.object({
    type: AdminSpotTypeSchema,
    status: AdminSpotStatusSchema,
    indoor: z.boolean(),
    description: z.string(),
    tags: z.string(),
});

type EditGeneralInfoValues = z.infer<typeof editGeneralInfoSchema>;

// ============================================================================
// Helper components
// ============================================================================

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm">{children}</span>
        </div>
    );
}

function DateField({ label, value }: { label: string; value: Date | null }) {
    if (!value) return <Field label={label}>-</Field>;
    return <Field label={label}>{format(value, 'PPpp')}</Field>;
}

function TypeBadge({ type }: { type: string }) {
    const variant = type === 'street' ? 'default' : type === 'park' || type === 'diy' ? 'secondary' : 'outline';
    return <Badge variant={variant}>{type}</Badge>;
}

function StatusBadge({ status }: { status: string }) {
    const variant = status === 'rip' ? 'destructive' : status === 'wip' ? 'secondary' : 'outline';
    return <Badge variant={variant}>{status}</Badge>;
}


// ============================================================================
// Map Preview Card (placeholder)
// ============================================================================

function MapPreviewCard({ spot }: { spot: Spot }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <MapPin className="size-10" />
                        <p className="text-sm font-medium">Map preview coming soon</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Street">
                        {[spot.location.streetNumber, spot.location.streetName].filter(Boolean).join(' ') || '-'}
                    </Field>
                    <Field label="City">{spot.location.city || '-'}</Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Country">{spot.location.country || '-'}</Field>
                    <Field label="Coordinates">
                        {spot.geo[0].toFixed(5)}, {spot.geo[1].toFixed(5)}
                    </Field>
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================================================
// General Info Card
// ============================================================================

function GeneralInfoCard({ spot }: { spot: Spot }) {
    const [isEditing, setIsEditing] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<EditGeneralInfoValues>({
        resolver: zodResolver(editGeneralInfoSchema),
        defaultValues: {
            type: spot.type.toUpperCase() as z.infer<typeof AdminSpotTypeSchema>,
            status: spot.status.toUpperCase() as z.infer<typeof AdminSpotStatusSchema>,
            indoor: spot.indoor,
            description: spot.description ?? '',
            tags: spot.tags.join(', '),
        },
    });

    const mutation = useMutation({
        mutationFn: (values: EditGeneralInfoValues) => {
            const tags = values.tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);

            return client.admin.spots.updateGeneralInfo({
                id: spot.id,
                type: values.type,
                status: values.status,
                indoor: values.indoor,
                description: values.description || null,
                tags,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: orpc.spots.getSpotOverview.queryOptions({ input: { id: spot.id } }).queryKey,
            });
            setIsEditing(false);
        },
    });

    const handleCancel = () => {
        form.reset();
        mutation.reset();
        setIsEditing(false);
    };

    const handleEdit = () => {
        form.reset({
            type: spot.type.toUpperCase() as z.infer<typeof AdminSpotTypeSchema>,
            status: spot.status.toUpperCase() as z.infer<typeof AdminSpotStatusSchema>,
            indoor: spot.indoor,
            description: spot.description ?? '',
            tags: spot.tags.join(', '),
        });
        setIsEditing(true);
    };

    if (isEditing) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>General</CardTitle>
                    <Button variant="ghost" size="sm" onClick={handleCancel}>
                        Cancel
                    </Button>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
                            className="flex flex-col gap-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {['SHOP', 'STREET', 'PARK', 'DIY', 'PRIVATE'].map((t) => (
                                                        <SelectItem key={t} value={t}>
                                                            {t.toLowerCase()}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {['ACTIVE', 'WIP', 'RIP'].map((s) => (
                                                        <SelectItem key={s} value={s}>
                                                            {s.toLowerCase()}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="indoor"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center gap-3">
                                        <FormLabel>Indoor</FormLabel>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Spot description..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags</FormLabel>
                                        <FormControl>
                                            <Input placeholder="tag1, tag2, tag3" {...field} />
                                        </FormControl>
                                        <p className="text-xs text-muted-foreground">
                                            Comma separated
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {mutation.error && (
                                <p className="text-sm text-destructive">
                                    {mutation.error.message || 'Failed to update spot.'}
                                </p>
                            )}

                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? 'Saving...' : 'Save'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>General</CardTitle>
                <Button variant="ghost" size="icon" onClick={handleEdit}>
                    <Pencil className="size-4" />
                </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Type">
                        <TypeBadge type={spot.type} />
                    </Field>
                    <Field label="Status">
                        <StatusBadge status={spot.status} />
                    </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Indoor">
                        <Badge variant="outline">{spot.indoor ? 'yes' : 'no'}</Badge>
                    </Field>
                    <Field label="Added by">{spot.addedBy?.username ?? '-'}</Field>
                </div>

                {spot.description && (
                    <>
                        <Separator />
                        <Field label="Description">
                            <span className="whitespace-pre-wrap">{spot.description}</span>
                        </Field>
                    </>
                )}

                {spot.tags.length > 0 && (
                    <>
                        <Separator />
                        <div className="flex flex-col gap-2">
                            <span className="text-sm text-muted-foreground">Tags</span>
                            <div className="flex flex-wrap gap-1">
                                {spot.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {spot.openingHours.length > 0 && (
                    <>
                        <Separator />
                        <Field label="Opening Hours">
                            <span className="whitespace-pre-wrap">{spot.openingHours.join('\n')}</span>
                        </Field>
                    </>
                )}

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                    <DateField label="Created" value={spot.createdAt} />
                    <DateField label="Updated" value={spot.updatedAt} />
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================================================
// Social & Contact Card
// ============================================================================

function SocialContactCard({ spot }: { spot: Spot }) {
    const hasAnySocial = spot.website || spot.instagram || spot.facebook || spot.snapchat || spot.phone;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contact & Social</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {!hasAnySocial ? (
                    <p className="text-sm text-muted-foreground">No contact information.</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {spot.website && (
                            <a
                                href={spot.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm underline"
                            >
                                <Globe className="size-4" />
                                {spot.website}
                                <ExternalLink className="size-3" />
                            </a>
                        )}
                        {spot.instagram && (
                            <a
                                href={`https://instagram.com/${spot.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm underline"
                            >
                                <Instagram className="size-4" />
                                {spot.instagram}
                                <ExternalLink className="size-3" />
                            </a>
                        )}
                        {spot.facebook && (
                            <a
                                href={`https://facebook.com/${spot.facebook}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm underline"
                            >
                                <Facebook className="size-4" />
                                {spot.facebook}
                                <ExternalLink className="size-3" />
                            </a>
                        )}
                        {spot.snapchat && (
                            <span className="inline-flex items-center gap-2 text-sm">
                                <Ghost className="size-4" />
                                {spot.snapchat}
                            </span>
                        )}
                        {spot.phone && (
                            <a href={`tel:${spot.phone}`} className="inline-flex items-center gap-2 text-sm underline">
                                <Phone className="size-4" />
                                {spot.phone}
                            </a>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}



// ============================================================================
// Loading skeleton
// ============================================================================

function SpotDetailSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-24" />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Skeleton className="h-64 w-full rounded-lg" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-24" />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full" />
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full" />
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// ============================================================================
// Page component
// ============================================================================

export default function SpotInfoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const { data, isLoading, error } = useQuery(
        orpc.spots.getSpotOverview.queryOptions({
            input: { id },
        }),
    );

    if (error) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">
                    Spot <code>{id}</code> was not found.
                </p>
            </div>
        );
    }

    if (isLoading) {
        return <SpotDetailSkeleton />;
    }

    if (!data) return null;

    const { spot } = data;

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
                <MapPreviewCard spot={spot} />
            </div>
            <div className="flex flex-col gap-6">
                <GeneralInfoCard spot={spot} />
                <SocialContactCard spot={spot} />
            </div>
        </div>
    );
}
