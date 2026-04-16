import { MapPin } from 'lucide-react';

export default function SpotsMapPage() {
    return (
        <div className="flex h-96 items-center justify-center rounded-lg border border-dashed">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <MapPin className="h-10 w-10" />
                <p className="text-sm font-medium">Map coming soon</p>
            </div>
        </div>
    );
}
