'use client';

import { ImageIcon } from 'lucide-react';

export default function SpotMediaPage() {
    return (
        <div className="flex h-96 items-center justify-center rounded-lg border border-dashed">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="size-10" />
                <p className="text-sm font-medium">Media coming soon</p>
            </div>
        </div>
    );
}
