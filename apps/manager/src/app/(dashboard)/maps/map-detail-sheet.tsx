'use client';

import { useQuery } from '@tanstack/react-query';

import { Badge, Separator, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, Skeleton } from '@krak/ui';

import { orpc } from '@/lib/orpc';

const categoryLabels: Record<string, string> = {
    maps: 'Maps',
    video: 'Video',
    skater: 'Skaters',
    filmer: 'Filmers',
    photographer: 'Photographers',
    magazine: 'Magazines',
    skatepark: 'Skateparks',
    shop: 'Shops',
    years: 'Years',
    greatest: 'Greatest',
    members: 'Members',
    artist: 'Artists',
};

interface MapDetailSheetProps {
    mapId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MapDetailSheet({ mapId, open, onOpenChange }: MapDetailSheetProps) {
    const { data: map, isLoading } = useQuery(
        orpc.maps.fetch.queryOptions({
            input: { id: mapId! },
            enabled: !!mapId,
        }),
    );

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-lg">
                {isLoading ? (
                    <div className="flex flex-col gap-4 pt-4">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                ) : map ? (
                    <>
                        <SheetHeader>
                            <div className="flex items-center gap-2">
                                <SheetTitle>{map.name}</SheetTitle>
                                {map.staging && (
                                    <Badge variant="outline" className="text-xs">
                                        Staging
                                    </Badge>
                                )}
                            </div>
                            {map.subtitle && <SheetDescription>{map.subtitle}</SheetDescription>}
                        </SheetHeader>

                        <div className="flex flex-col gap-6 pt-6">
                            {/* Categories */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium">Categories</span>
                                <div className="flex flex-wrap gap-1">
                                    {map.categories.map((cat) => (
                                        <Badge key={cat} variant="secondary">
                                            {categoryLabels[cat] ?? cat}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Edito */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium">Edito</span>
                                <p className="text-sm text-muted-foreground">{map.edito || '\u2014'}</p>
                            </div>

                            {/* About */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium">About</span>
                                <p className="text-sm text-muted-foreground">{map.about || '\u2014'}</p>
                            </div>

                            <Separator />

                            {/* Videos */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium">Videos</span>
                                {map.videos.length > 0 ? (
                                    <ul className="flex flex-col gap-1">
                                        {map.videos.map((url, i) => (
                                            <li key={i}>
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-primary underline-offset-4 hover:underline"
                                                >
                                                    {url}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No videos</p>
                                )}
                            </div>

                            {/* Soundtrack */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium">Soundtrack</span>
                                {map.soundtrack.length > 0 ? (
                                    <ul className="flex flex-col gap-1">
                                        {map.soundtrack.map((track, i) => (
                                            <li key={i} className="text-sm text-muted-foreground">
                                                {track}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No soundtrack</p>
                                )}
                            </div>

                            <Separator />

                            {/* Dates */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">ID</span>
                                    <span className="text-sm font-mono text-muted-foreground">{map.id}</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </SheetContent>
        </Sheet>
    );
}
