'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Pencil } from 'lucide-react';
import { useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';

import type { ContractOutputs } from '@krak/contracts';
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@krak/ui';

import { client, orpc } from '@/lib/orpc';

type Spot = ContractOutputs['spots']['getSpotOverview']['spot'];

export function EditSpotLocationDialog({ spot }: { spot: Spot }) {
    const [longitude, latitude] = spot.geo;
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState<[number, number]>([longitude, latitude]);
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: () =>
            client.admin.spots.updateLocation({
                id: spot.id,
                longitude: position[0],
                latitude: position[1],
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: orpc.spots.getSpotOverview.queryOptions({ input: { id: spot.id } }).queryKey,
            });
            setOpen(false);
        },
    });

    const handleOpenChange = (nextOpen: boolean) => {
        if (mutation.isPending) return;
        if (nextOpen) {
            setPosition([longitude, latitude]);
            mutation.reset();
        }
        setOpen(nextOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="absolute top-2 left-2 z-10" size="sm" variant="secondary">
                    <Pencil className="size-4" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit location</DialogTitle>
                    <DialogDescription>Drag the pin or click the map to set the spot location.</DialogDescription>
                </DialogHeader>
                <div className="h-[60vh] min-h-80 overflow-hidden rounded-lg border">
                    <Map
                        initialViewState={{ longitude, latitude, zoom: 15 }}
                        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                        onClick={(event) => setPosition([event.lngLat.lng, event.lngLat.lat])}
                    >
                        <NavigationControl position="top-right" showCompass={false} />
                        <Marker
                            longitude={position[0]}
                            latitude={position[1]}
                            anchor="bottom"
                            draggable
                            onDragEnd={(event) => setPosition([event.lngLat.lng, event.lngLat.lat])}
                        >
                            <MapPin className="size-10 fill-primary text-primary-foreground drop-shadow-md" />
                        </Marker>
                    </Map>
                </div>
                <p className="text-sm text-muted-foreground">
                    {position[1].toFixed(5)}, {position[0].toFixed(5)}
                </p>
                {mutation.error && (
                    <p className="text-sm text-destructive">{mutation.error.message || 'Failed to update location.'}</p>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={mutation.isPending}>
                        Cancel
                    </Button>
                    <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                        {mutation.isPending ? 'Saving...' : 'Save location'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
