'use client';

import { ChevronDown, GitMerge, Trash2 } from 'lucide-react';
import { useState } from 'react';

import type { ContractOutputs } from '@krak/contracts';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@krak/ui';

import { MergeSpotDialog } from './merge-spot-dialog';
import { SpotDeleteDialog } from './spot-delete-dialog';

type SpotOverview = ContractOutputs['spots']['getSpotOverview'];
type Spot = SpotOverview['spot'];

export function SpotActions({ spot }: { spot: Spot }) {
    const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        Actions
                        <ChevronDown className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setMergeDialogOpen(true)}>
                        <GitMerge className="size-4" />
                        Merge to
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => setDeleteDialogOpen(true)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="size-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <MergeSpotDialog spot={spot} open={mergeDialogOpen} onOpenChange={setMergeDialogOpen} />
            <SpotDeleteDialog spot={spot} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
        </>
    );
}
