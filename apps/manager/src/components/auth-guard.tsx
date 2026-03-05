'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@krak/ui';

import { useSession } from '@/lib/auth';

export function AuthGuard({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    useEffect(() => {
        if (isPending) return;

        if (!session?.user || session.user.role !== 'ADMIN') {
            router.replace('/login');
        }
    }, [session, isPending, router]);

    if (isPending) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <div className="space-y-4 w-64">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
        );
    }

    if (!session?.user || session.user.role !== 'ADMIN') {
        return null;
    }

    return <>{children}</>;
}
