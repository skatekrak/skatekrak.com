import Link from 'next/link';

import { cn } from '@krak/ui';

const tabs = [
    { label: 'Info', getHref: (id: string) => `/spots/${id}/info` },
    { label: 'Media', getHref: (id: string) => `/spots/${id}/media` },
];

type SpotTabsProps = {
    id: string;
    pathname: string;
};

export function SpotTabs({ id, pathname }: SpotTabsProps) {
    return (
        <div className="inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
            {tabs.map((tab) => {
                const href = tab.getHref(id);

                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all',
                            pathname.startsWith(href)
                                ? 'bg-background text-foreground shadow'
                                : 'hover:text-foreground/80',
                        )}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    );
}
