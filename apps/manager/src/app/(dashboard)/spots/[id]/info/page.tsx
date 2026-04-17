'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ExternalLink, Facebook, Ghost, Globe, Instagram, MapPin, Phone } from 'lucide-react';
import { use } from 'react';

import type { ContractOutputs } from '@krak/contracts';
import { Badge, Card, CardContent, CardHeader, CardTitle, Separator, Skeleton } from '@krak/ui';

import { orpc } from '@/lib/orpc';

type SpotOverview = ContractOutputs['spots']['getSpotOverview'];
type Spot = SpotOverview['spot'];

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
    return (
        <Card>
            <CardHeader>
                <CardTitle>General</CardTitle>
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
// Statistics Card
// ============================================================================

function StatCell({ label, value }: { label: string; value: number | null | undefined }) {
    return (
        <div className="flex w-20 flex-col items-center gap-1 rounded-md border p-3">
            <span className="text-2xl font-semibold">{value ?? 0}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
        </div>
    );
}

function StatsCard({ spot }: { spot: Spot }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    <StatCell label="Media" value={spot.mediasStat?.all} />
                    <StatCell label="Clips" value={spot.clipsStat?.all} />
                    <StatCell label="Tricks" value={spot.tricksDoneStat?.all} />
                    <StatCell label="Comments" value={spot.commentsStat?.all} />
                </div>
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
                <StatsCard spot={spot} />
            </div>
            <div className="flex flex-col gap-6">
                <GeneralInfoCard spot={spot} />
                <SocialContactCard spot={spot} />
            </div>
        </div>
    );
}
