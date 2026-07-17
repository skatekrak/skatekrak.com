'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MapPin, Pencil, Search } from 'lucide-react';
import { useEffect, useRef, useState, type RefObject } from 'react';
import Map, { Marker, NavigationControl, type MapRef } from 'react-map-gl/maplibre';

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
    Input,
} from '@krak/ui';

import { client, orpc } from '@/lib/orpc';

type Spot = ContractOutputs['spots']['getSpotOverview']['spot'];
type Position = [longitude: number, latitude: number];

function AddressSearch({
    sessionToken,
    value,
    disabled,
    onSelect,
}: {
    sessionToken: string;
    value: string;
    disabled: boolean;
    onSelect: (placeId: string) => void;
}) {
    const [search, setSearch] = useState(value);
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const addressQuery = useQuery({
        queryKey: ['spot-addresses', debouncedSearch, sessionToken],
        queryFn: () => client.admin.spots.searchAddresses({ query: debouncedSearch, sessionToken }),
        enabled: showSuggestions && debouncedSearch.length >= 3 && Boolean(sessionToken),
    });

    useEffect(() => setSearch(value), [value]);
    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(search.trim()), 300);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <div
            className="relative"
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setShowSuggestions(false);
            }}
        >
            <Search className="pointer-events-none absolute top-2.5 left-3 z-10 size-4 text-muted-foreground" />
            <Input
                value={search}
                onChange={(event) => {
                    setSearch(event.target.value);
                    setShowSuggestions(true);
                }}
                placeholder="Search an address"
                className="pl-9"
                autoComplete="off"
                aria-label="Search an address"
                aria-expanded={showSuggestions && debouncedSearch.length >= 3}
                disabled={disabled}
            />
            {showSuggestions && debouncedSearch.length >= 3 && (
                <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                    {addressQuery.isLoading ? (
                        <p className="px-3 py-2 text-sm text-muted-foreground">Searching...</p>
                    ) : addressQuery.error ? (
                        <p className="px-3 py-2 text-sm text-destructive">Address search failed.</p>
                    ) : addressQuery.data?.length ? (
                        addressQuery.data.map((result) => (
                            <Button
                                key={result.id}
                                type="button"
                                variant="ghost"
                                className="h-auto w-full justify-start whitespace-normal px-3 py-2 text-left"
                                disabled={disabled}
                                onClick={() => {
                                    setShowSuggestions(false);
                                    onSelect(result.id);
                                }}
                            >
                                {result.label}
                            </Button>
                        ))
                    ) : (
                        <p className="px-3 py-2 text-sm text-muted-foreground">No addresses found.</p>
                    )}
                </div>
            )}
        </div>
    );
}

function LocationPickerMap({
    initialPosition,
    position,
    mapRef,
    onChange,
}: {
    initialPosition: Position;
    position: Position;
    mapRef: RefObject<MapRef | null>;
    onChange: (position: Position) => void;
}) {
    return (
        <div className="h-[60vh] min-h-80 overflow-hidden rounded-lg border">
            <Map
                ref={mapRef}
                initialViewState={{ longitude: initialPosition[0], latitude: initialPosition[1], zoom: 15 }}
                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                onClick={(event) => onChange([event.lngLat.lng, event.lngLat.lat])}
            >
                <NavigationControl position="top-right" showCompass={false} />
                <Marker
                    longitude={position[0]}
                    latitude={position[1]}
                    anchor="bottom"
                    draggable
                    onDragEnd={(event) => onChange([event.lngLat.lng, event.lngLat.lat])}
                >
                    <MapPin className="size-10 fill-primary text-primary-foreground drop-shadow-md" />
                </Marker>
            </Map>
        </div>
    );
}

export function EditSpotLocationDialog({ spot }: { spot: Spot }) {
    const [longitude, latitude] = spot.geo;
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState<Position>([longitude, latitude]);
    const [resolvedAddress, setResolvedAddress] = useState('');
    const [sessionToken, setSessionToken] = useState('');
    const mapRef = useRef<MapRef>(null);
    const queryClient = useQueryClient();
    const resolveAddressMutation = useMutation({
        mutationFn: (placeId: string) => client.admin.spots.resolveAddress({ placeId, sessionToken }),
        onSuccess: (place) => {
            setPosition([place.longitude, place.latitude]);
            setResolvedAddress(place.address);
            setSessionToken(crypto.randomUUID());
            mapRef.current?.flyTo({ center: [place.longitude, place.latitude], zoom: 16, duration: 300 });
        },
    });
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
        if (mutation.isPending || resolveAddressMutation.isPending) return;
        if (nextOpen) {
            setPosition([longitude, latitude]);
            setResolvedAddress('');
            setSessionToken(crypto.randomUUID());
            mutation.reset();
            resolveAddressMutation.reset();
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
                    <DialogDescription>Search for an address, drag the pin, or click the map.</DialogDescription>
                </DialogHeader>
                <AddressSearch
                    sessionToken={sessionToken}
                    value={resolvedAddress}
                    disabled={resolveAddressMutation.isPending}
                    onSelect={resolveAddressMutation.mutate}
                />
                <LocationPickerMap
                    initialPosition={[longitude, latitude]}
                    position={position}
                    mapRef={mapRef}
                    onChange={setPosition}
                />
                <p className="text-sm text-muted-foreground">
                    {position[1].toFixed(5)}, {position[0].toFixed(5)}
                </p>
                {mutation.error && (
                    <p className="text-sm text-destructive">{mutation.error.message || 'Failed to update location.'}</p>
                )}
                {resolveAddressMutation.error && <p className="text-sm text-destructive">Address lookup failed.</p>}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        disabled={mutation.isPending || resolveAddressMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isPending || resolveAddressMutation.isPending}
                    >
                        {mutation.isPending ? 'Saving...' : 'Save location'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
