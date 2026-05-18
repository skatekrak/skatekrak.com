'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Pencil, X } from 'lucide-react';
import { useRef, useState } from 'react';

import type { ContractOutputs } from '@krak/contracts';
import { Badge, Button, Input } from '@krak/ui';

import { client, orpc } from '@/lib/orpc';

import type { KeyboardEvent } from 'react';

type SpotOverview = ContractOutputs['spots']['getSpotOverview'];
type Spot = SpotOverview['spot'];

function StatCell({ label, value }: { label: string; value: number | null | undefined }) {
    return (
        <div className="flex w-20 flex-col items-center gap-1 rounded-md border p-3">
            <span className="text-2xl font-semibold">{value ?? 0}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
        </div>
    );
}

function TypeBadge({ type }: { type: string }) {
    const variant = type === 'street' ? 'default' : type === 'park' || type === 'diy' ? 'secondary' : 'outline';

    return <Badge variant={variant}>{type}</Badge>;
}

function StatusBadge({ status }: { status: string }) {
    const variant = status === 'rip' ? 'destructive' : status === 'wip' ? 'secondary' : 'outline';

    return <Badge variant={variant}>{status}</Badge>;
}

export function SpotHero({ spot }: { spot: Spot }) {
    const location = [spot.location.city, spot.location.country].filter(Boolean).join(', ');
    const queryClient = useQueryClient();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(spot.name);
    const inputRef = useRef<HTMLInputElement>(null);

    const mutation = useMutation({
        mutationFn: (newName: string) => client.admin.spots.updateGeneralInfo({ id: spot.id, name: newName }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: orpc.spots.getSpotOverview.queryOptions({ input: { id: spot.id } }).queryKey,
            });
            setIsEditing(false);
        },
    });

    const handleEdit = () => {
        setName(spot.name);
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleCancel = () => {
        setName(spot.name);
        mutation.reset();
        setIsEditing(false);
    };

    const handleSave = () => {
        const trimmed = name.trim();
        if (!trimmed || trimmed === spot.name) {
            handleCancel();
            return;
        }
        mutation.mutate(trimmed);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') handleCancel();
    };

    return (
        <div className="flex items-center gap-6 py-4">
            <div className="flex shrink-0 flex-col gap-1">
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <Input
                                ref={inputRef}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="h-9 w-64 text-2xl font-semibold"
                                disabled={mutation.isPending}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={handleSave}
                                disabled={mutation.isPending}
                            >
                                <Check className="size-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={handleCancel}
                                disabled={mutation.isPending}
                            >
                                <X className="size-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl font-semibold">{spot.name}</h1>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleEdit}>
                                <Pencil className="size-4" />
                            </Button>
                        </>
                    )}
                </div>
                {mutation.error ? (
                    <p className="text-sm text-destructive">{mutation.error.message || 'Failed to update name.'}</p>
                ) : null}
                {location ? <p className="text-sm text-muted-foreground">{location}</p> : null}
                <div className="mt-1 flex gap-2">
                    <TypeBadge type={spot.type} />
                    <StatusBadge status={spot.status} />
                    {spot.indoor ? <Badge variant="outline">indoor</Badge> : null}
                </div>
            </div>
            <div className="ml-auto flex items-center gap-4">
                <div className="flex gap-2">
                    <StatCell label="Media" value={spot.mediasStat?.all} />
                    <StatCell label="Clips" value={spot.clipsStat?.all} />
                    <StatCell label="Tricks" value={spot.tricksDoneStat?.all} />
                    <StatCell label="Comments" value={spot.commentsStat?.all} />
                </div>
            </div>
        </div>
    );
}
