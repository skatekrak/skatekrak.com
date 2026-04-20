'use client';

import type { ContractOutputs } from '@krak/contracts';
import { Badge, Card, CardContent, CardHeader, CardTitle, Separator } from '@krak/ui';

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

type MapData = ContractOutputs['maps']['fetch'];

interface MapInfoCardProps {
    map: MapData;
}

export function MapInfoCard({ map }: MapInfoCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CardTitle>{map.name}</CardTitle>
                    {map.staging && (
                        <Badge variant="outline" className="text-xs">
                            Staging
                        </Badge>
                    )}
                </div>
                {map.subtitle && <p className="text-sm text-muted-foreground">{map.subtitle}</p>}
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

                {/* ID */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">ID</span>
                    <span className="font-mono text-sm text-muted-foreground">{map.id}</span>
                </div>
            </CardContent>
        </Card>
    );
}
