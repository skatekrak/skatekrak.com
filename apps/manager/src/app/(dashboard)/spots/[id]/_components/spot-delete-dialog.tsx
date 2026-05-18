'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { ContractOutputs } from '@krak/contracts';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    Input,
} from '@krak/ui';

import { client } from '@/lib/orpc';

import { deleteSpotAssociatedDataLabels, isSpotDeleteConfirmationValid } from './spot-delete-confirmation';

type SpotOverview = ContractOutputs['spots']['getSpotOverview'];
type Spot = SpotOverview['spot'];

type SpotDeleteDialogProps = {
    spot: Spot;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function SpotDeleteDialog({ spot, open, onOpenChange }: SpotDeleteDialogProps) {
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const router = useRouter();
    const queryClient = useQueryClient();
    const canDelete = isSpotDeleteConfirmationValid(deleteConfirmation, spot.name);

    const deleteMutation = useMutation({
        mutationFn: () => client.admin.spots.delete({ id: spot.id }),
        onSuccess: () => {
            queryClient.invalidateQueries();
            setDeleteConfirmation('');
            onOpenChange(false);
            router.replace('/spots');
        },
    });

    const handleOpenChange = (nextOpen: boolean) => {
        if (deleteMutation.isPending) return;
        if (!nextOpen) {
            setDeleteConfirmation('');
            deleteMutation.reset();
        }
        onOpenChange(nextOpen);
    };

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete spot</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete {spot.name}? This action cannot be undone and will remove all
                        associated data below.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col gap-4">
                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {deleteSpotAssociatedDataLabels.map((label) => (
                            <li key={label}>{label}</li>
                        ))}
                    </ul>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium" htmlFor="delete-spot-confirmation">
                            Type the spot name to confirm
                        </label>
                        <Input
                            id="delete-spot-confirmation"
                            value={deleteConfirmation}
                            onChange={(event) => setDeleteConfirmation(event.target.value)}
                            placeholder={spot.name}
                            disabled={deleteMutation.isPending}
                        />
                    </div>
                </div>
                {deleteMutation.error && (
                    <p className="text-sm text-destructive">
                        {deleteMutation.error.message || 'Failed to delete spot.'}
                    </p>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(event) => {
                            event.preventDefault();
                            deleteMutation.mutate();
                        }}
                        disabled={!canDelete || deleteMutation.isPending}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
