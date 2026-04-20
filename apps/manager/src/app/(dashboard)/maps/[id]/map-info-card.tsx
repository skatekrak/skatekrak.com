'use client';

import type { ContractOutputs } from '@krak/contracts';
import { Badge, Card, CardContent, CardHeader, CardTitle, KrakImage, Separator } from '@krak/ui';

import { categoryLabels } from '../_components/map-form-types';

type MapData = ContractOutputs['maps']['fetch'];

interface MapInfoCardProps {
    map: MapData;
}

export function MapInfoCard({ map }: MapInfoCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <CardTitle>{map.name}</CardTitle>
                            {map.staging && (
                                <Badge variant="outline" className="text-xs">
                                    Staging
                                </Badge>
                            )}
                        </div>
                        {map.subtitle && <p className="text-sm text-muted-foreground">{map.subtitle}</p>}
                    </div>
                    <KrakImage
                        path={`assets/maps/custom-maps/${map.id}.png`}
                        alt={map.name}
                        options={{ width: 80, height: 80, resizingType: 'fit', format: 'webp' }}
                        className="size-10 shrink-0 rounded-md object-contain"
                    />
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
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
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Edito</span>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{map.edito || '\u2014'}</p>
                </div>

                {/* About */}
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">About</span>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{map.about || '\u2014'}</p>
                </div>

                <Separator />

                {/* Videos */}
                {map.videos.length > 0 && (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Videos ({map.videos.length})</span>
                        <ul className="flex flex-col gap-1">
                            {map.videos.map((url, i) => (
                                <li key={i}>
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="break-all text-sm text-primary underline-offset-4 hover:underline"
                                    >
                                        {url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Soundtrack */}
                {map.soundtrack.length > 0 && (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Soundtrack ({map.soundtrack.length})</span>
                        <ul className="flex flex-col gap-1">
                            {map.soundtrack.map((track, i) => (
                                <li key={i} className="text-sm text-muted-foreground">
                                    {track}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {(map.videos.length > 0 || map.soundtrack.length > 0) && <Separator />}

                {/* ID */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">ID</span>
                    <span className="font-mono text-sm text-muted-foreground">{map.id}</span>
                </div>
            </CardContent>
        </Card>
    );
}
