import { Skeleton } from '@krak/ui';

export function SpotHeroSkeleton() {
    return (
        <div className="flex items-center gap-6 py-4">
            <div className="flex shrink-0 flex-col gap-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="mt-1 flex gap-2">
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                </div>
            </div>
            <div className="ml-auto flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-20 rounded-md" />
                ))}
            </div>
        </div>
    );
}
