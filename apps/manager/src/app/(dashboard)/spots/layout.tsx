'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@krak/ui/lib/utils';

import { SiteHeader } from '@/components/site-header';

const tabs = [
    { label: 'List', href: '/spots/list' },
    { label: 'Map', href: '/spots/map' },
];

export default function SpotsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <>
            <SiteHeader title="Spots" />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-fit">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all',
                                pathname.startsWith(tab.href)
                                    ? 'bg-background text-foreground shadow'
                                    : 'hover:text-foreground/80',
                            )}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>
                {children}
            </div>
        </>
    );
}
