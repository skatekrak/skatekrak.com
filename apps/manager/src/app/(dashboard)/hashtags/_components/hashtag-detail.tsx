'use client';

import { useQuery } from '@tanstack/react-query';
import { format, formatDistanceToNow } from 'date-fns';
import { Film, Image, Map as MapIcon } from 'lucide-react';
import Link from 'next/link';

import type { ContractOutputs } from '@krak/contracts';
import { Badge, SheetDescription, SheetHeader, SheetTitle, Skeleton } from '@krak/ui';

import { MediaThumbnail, hasDisplayableImage } from '@/components/media';
import { orpc } from '@/lib/orpc';

type HashtagOverview = ContractOutputs['admin']['hashtags']['get'];

export function HashtagDetail({ tag, onSelectTag }: { tag: string; onSelectTag: (tag: string) => void }) {
    const { data, isError } = useQuery(orpc.admin.hashtags.get.queryOptions({ input: { tag } }));
    const { data: recent } = useQuery(
        orpc.admin.media.list.queryOptions({ input: { hashtags: [tag], perPage: 6, page: 1 } }),
    );

    const mediaHref = `/media?hashtags=${encodeURIComponent(tag)}`;
    const spotsHref = `/spots/list?tags=${encodeURIComponent(tag.replace(/^#/, ''))}`;

    return (
        <>
            <SheetHeader className="gap-2 pr-10">
                <SheetTitle className="text-2xl break-all">{tag}</SheetTitle>
                {data?.map ? (
                    <Link
                        href={`/maps/${data.map.id}`}
                        className="flex w-fit items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
                    >
                        <MapIcon className="size-4" />
                        Map: {data.map.name}
                    </Link>
                ) : (
                    <SheetDescription>{data ? 'Not linked to a map' : 'Hashtag overview'}</SheetDescription>
                )}
            </SheetHeader>

            {isError ? (
                <p className="px-4 text-sm text-destructive">Couldn&apos;t load this hashtag. Close and try again.</p>
            ) : !data ? (
                <OverviewSkeleton />
            ) : data.mediaCount === 0 && data.spotCount === 0 ? (
                <p className="px-4 text-sm text-muted-foreground">No media or spots use {tag}.</p>
            ) : (
                <div className="flex flex-col gap-8 overflow-y-auto px-4 pb-6">
                    <Stats data={data} />
                    {data.mediaCount > 1 && <Activity monthly={data.monthly} />}

                    {data.mediaCount > 0 && (
                        <Section title="Recent media" href={mediaHref} linkLabel={`View all ${data.mediaCount}`}>
                            <div className="grid grid-cols-3 gap-2">
                                {recent
                                    ? recent.media.map((m) => (
                                          <Link
                                              key={m.id}
                                              href={`${mediaHref}&media=${m.id}`}
                                              className="relative aspect-square overflow-hidden rounded-md bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                              title={m.caption ?? undefined}
                                          >
                                              {hasDisplayableImage(m.image) ? (
                                                  <MediaThumbnail image={m.image} alt={m.caption || 'Media'} />
                                              ) : (
                                                  <span className="flex size-full items-center justify-center text-muted-foreground">
                                                      {m.type === 'VIDEO' ? (
                                                          <Film className="size-5" />
                                                      ) : (
                                                          <Image className="size-5" />
                                                      )}
                                                  </span>
                                              )}
                                              {m.type === 'VIDEO' && hasDisplayableImage(m.image) && (
                                                  <Film className="absolute right-1.5 bottom-1.5 size-4 text-white drop-shadow" />
                                              )}
                                          </Link>
                                      ))
                                    : Array.from({ length: Math.min(6, data.mediaCount) }).map((_, i) => (
                                          <Skeleton key={i} className="aspect-square rounded-md" />
                                      ))}
                            </div>
                        </Section>
                    )}

                    {data.topSpots.length > 0 && (
                        <Section title="Top spots" href={spotsHref} linkLabel={`View all ${data.spotCount}`}>
                            <ul className="flex flex-col">
                                {data.topSpots.map((s) => (
                                    <li key={s.id}>
                                        <Link
                                            href={`/spots/${s.id}`}
                                            className="-mx-2 flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted"
                                        >
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-sm font-medium">{s.name}</span>
                                                <span className="block truncate text-xs text-muted-foreground">
                                                    {[s.city, s.country].filter(Boolean).join(', ') || 'No location'}
                                                </span>
                                            </span>
                                            {s.taggedDirectly && (
                                                <Badge variant="outline" title="Tag set on the spot itself">
                                                    tagged
                                                </Badge>
                                            )}
                                            <span className="text-sm tabular-nums text-muted-foreground">
                                                {s.mediaCount}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Section>
                    )}

                    {data.topContributors.length > 0 && (
                        <Section title="Top contributors">
                            <ul className="flex flex-col gap-1.5">
                                {data.topContributors.map((c) => (
                                    <li key={c.username} className="flex items-baseline justify-between gap-3 text-sm">
                                        <span className="truncate">{c.username}</span>
                                        <span className="tabular-nums text-muted-foreground">
                                            {c.mediaCount}
                                            <span className="ml-1 text-xs">
                                                ({Math.round((c.mediaCount / data.mediaCount) * 100)}%)
                                            </span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </Section>
                    )}

                    {data.similar.length > 0 && (
                        <Section title="Similar tags">
                            <div className="flex flex-wrap gap-1.5">
                                {data.similar.map((s) => (
                                    <button key={s.tag} type="button" onClick={() => onSelectTag(s.tag)}>
                                        <Badge variant="secondary" className="cursor-pointer gap-1.5 hover:bg-muted">
                                            {s.tag}
                                            <span className="tabular-nums text-muted-foreground">{s.mediaCount}</span>
                                        </Badge>
                                    </button>
                                ))}
                            </div>
                        </Section>
                    )}
                </div>
            )}
        </>
    );
}

function Stats({ data }: { data: HashtagOverview }) {
    const items = [
        { label: 'Media', value: data.mediaCount.toLocaleString() },
        { label: 'Spots', value: data.spotCount.toLocaleString() },
        {
            label: 'First used',
            value: data.firstUsedAt ? format(data.firstUsedAt, 'MMM yyyy') : '—',
            title: data.firstUsedAt ? format(data.firstUsedAt, 'PP') : undefined,
        },
        {
            label: 'Last used',
            value: data.lastUsedAt ? formatDistanceToNow(data.lastUsedAt, { addSuffix: true }) : '—',
            title: data.lastUsedAt ? format(data.lastUsedAt, 'PP') : undefined,
        },
    ];

    return (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            {items.map((item) => (
                <div key={item.label}>
                    <dt className="text-xs text-muted-foreground">{item.label}</dt>
                    <dd className="text-base font-semibold tabular-nums" title={item.title}>
                        {item.value}
                    </dd>
                </div>
            ))}
        </dl>
    );
}

const label = (month: string) => format(new Date(`${month}-01T00:00:00`), 'MMM yy');

function Activity({ monthly }: { monthly: HashtagOverview['monthly'] }) {
    const peak = Math.max(...monthly.map((m) => m.count));

    return (
        <Section title="Last 12 months">
            {peak === 0 ? (
                <p className="text-sm text-muted-foreground">No use in the last 12 months.</p>
            ) : (
                <figure>
                    <div className="flex h-12 items-end gap-1" aria-hidden>
                        {monthly.map((m) => (
                            <div
                                key={m.month}
                                title={`${label(m.month)}: ${m.count}`}
                                className="flex-1 rounded-sm bg-primary/80"
                                style={{
                                    height: m.count ? `${Math.max(8, (m.count / peak) * 100)}%` : '2px',
                                    opacity: m.count ? 1 : 0.25,
                                }}
                            />
                        ))}
                    </div>
                    <figcaption className="mt-1.5 flex justify-between text-xs text-muted-foreground">
                        <span>{label(monthly[0]!.month)}</span>
                        <span>peak {peak}/mo</span>
                        <span>{label(monthly.at(-1)!.month)}</span>
                    </figcaption>
                    <ul className="sr-only">
                        {monthly.map((m) => (
                            <li key={m.month}>
                                {label(m.month)}: {m.count} media
                            </li>
                        ))}
                    </ul>
                </figure>
            )}
        </Section>
    );
}

function Section({
    title,
    href,
    linkLabel,
    children,
}: {
    title: string;
    href?: string;
    linkLabel?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-sm font-semibold">{title}</h3>
                {href && (
                    <Link
                        href={href}
                        className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                        {linkLabel}
                    </Link>
                )}
            </div>
            {children}
        </section>
    );
}

function OverviewSkeleton() {
    return (
        <div className="flex flex-col gap-8 px-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-1">
                        <Skeleton className="h-3 w-14" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                ))}
            </div>
            <Skeleton className="h-16 w-full" />
            <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-md" />
                ))}
            </div>
        </div>
    );
}
