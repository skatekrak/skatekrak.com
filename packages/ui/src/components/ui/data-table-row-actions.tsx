import { MoreHorizontal } from 'lucide-react';

import { Button } from '@krak/ui/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@krak/ui/components/ui/dropdown-menu';

interface DataTableRowActionsProps {
    children: React.ReactNode;
}

export function DataTableRowActions({ children }: DataTableRowActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
