'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { ContractOutputs } from '@krak/contracts';
import {
    Badge,
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Input,
} from '@krak/ui';

import { client, orpc } from '@/lib/orpc';

type SpotOverview = ContractOutputs['spots']['getSpotOverview'];
type Spot = SpotOverview['spot'];

type MergeSpotDialogProps = {
    spot: Spot;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function MergeSpotDialog({ spot, open, onOpenChange }: MergeSpotDialogProps) {
    const [targetInput, setTargetInput] = useState('');
    const [targetSpot, setTargetSpot] = useState<Spot | null>(null);
    const [targetError, setTargetError] = useState<string | null>(null);
    const router = useRouter();
    const queryClient = useQueryClient();

    const targetSpotId = targetInput.trim();
    const isSameSpot = targetSpotId === spot.id;
    const canSubmit = targetSpot != null && targetSpot.id === targetSpotId && !isSameSpot;
    const targetAddress = targetSpot
        ? [
              targetSpot.location.streetNumber,
              targetSpot.location.streetName,
              targetSpot.location.city,
              targetSpot.location.country,
          ]
              .filter(Boolean)
              .join(', ')
        : '';

    const targetSpotMutation = useMutation({
        mutationFn: (id: string) => client.spots.getSpot({ id }),
        onSuccess: (loadedSpot) => {
            setTargetSpot(loadedSpot);
            setTargetError(null);
        },
        onError: () => {
            setTargetSpot(null);
            setTargetError('No spot found with this ID.');
        },
    });

    const mutation = useMutation({
        mutationFn: () => client.admin.spots.merge({ sourceSpotId: spot.id, targetSpotId }),
        onSuccess: () => {
            const mergedTargetSpotId = targetSpotId;
            queryClient.invalidateQueries();
            queryClient.invalidateQueries({
                queryKey: orpc.spots.getSpotOverview.queryOptions({ input: { id: mergedTargetSpotId } }).queryKey,
            });
            setTargetInput('');
            setTargetSpot(null);
            setTargetError(null);
            targetSpotMutation.reset();
            mutation.reset();
            onOpenChange(false);
            router.replace(`/spots/${mergedTargetSpotId}/info`);
        },
    });
    const resetMutation = mutation.reset;
    const loadTargetSpot = targetSpotMutation.mutate;
    const resetTargetSpotMutation = targetSpotMutation.reset;

    const resetDialog = () => {
        setTargetInput('');
        setTargetSpot(null);
        setTargetError(null);
        targetSpotMutation.reset();
        mutation.reset();
    };

    const handleInputChange = (value: string) => {
        setTargetInput(value);
        setTargetSpot(null);
        setTargetError(null);
        targetSpotMutation.reset();
        mutation.reset();
    };

    const handleSubmit = () => {
        if (!canSubmit || mutation.isPending) return;
        mutation.mutate();
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (mutation.isPending) return;
        if (!nextOpen) resetDialog();
        onOpenChange(nextOpen);
    };

    useEffect(() => {
        setTargetInput('');
        setTargetSpot(null);
        setTargetError(null);
        resetTargetSpotMutation();
        resetMutation();
    }, [resetMutation, resetTargetSpotMutation, spot.id]);

    useEffect(() => {
        if (!open || !targetSpotId || isSameSpot) return;
        loadTargetSpot(targetSpotId);
    }, [isSameSpot, loadTargetSpot, open, targetSpotId]);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Merge spot</DialogTitle>
                    <DialogDescription>
                        Choose the spot that should receive all content from {spot.name}, or paste a spot ID directly.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <Input
                        value={targetInput}
                        onChange={(event) => handleInputChange(event.target.value)}
                        placeholder="Paste target spot ID"
                        aria-label="Target spot ID"
                        disabled={mutation.isPending || targetSpotMutation.isPending}
                    />

                    <div className="h-32 rounded-md border p-3">
                        {targetSpotMutation.isPending ? (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                Loading spot...
                            </div>
                        ) : targetSpot ? (
                            <div className="flex flex-col gap-1 text-sm">
                                <span className="font-medium">{targetSpot.name}</span>
                                <div className="flex gap-2">
                                    <Badge variant="outline">{targetSpot.type}</Badge>
                                    <Badge variant={targetSpot.status === 'rip' ? 'destructive' : 'secondary'}>
                                        {targetSpot.status}
                                    </Badge>
                                </div>
                                <span className="text-muted-foreground">{targetAddress || 'No address'}</span>
                            </div>
                        ) : targetError ? (
                            <div className="flex h-full items-center justify-center text-sm text-destructive">
                                {targetError}
                            </div>
                        ) : targetSpotId ? (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                Enter a valid target spot ID.
                            </div>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
                                <span className="text-sm font-medium">Paste a target spot ID</span>
                                <span className="text-xs text-muted-foreground">
                                    The target spot will load automatically.
                                </span>
                            </div>
                        )}
                    </div>

                    {isSameSpot && <p className="text-sm text-destructive">A spot cannot be merged into itself.</p>}
                    {mutation.error && (
                        <p className="text-sm text-destructive">{mutation.error.message || 'Failed to merge spot.'}</p>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={mutation.isPending}>
                        Cancel
                    </Button>
                    <Button variant="destructive" disabled={!canSubmit || mutation.isPending} onClick={handleSubmit}>
                        {mutation.isPending
                            ? 'Merging...'
                            : `Merge into ${(targetSpot?.name ?? targetSpotId) || 'target spot'}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
