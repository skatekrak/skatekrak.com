'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { useState, type ReactNode } from 'react';

import { ImgproxyProvider } from '@krak/ui';

import { env } from '@/env';

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                    },
                },
            }),
    );

    const imgproxyUrl = env.NEXT_PUBLIC_IMGPROXY_URL;

    let content = children;
    if (imgproxyUrl) {
        content = <ImgproxyProvider baseUrl={imgproxyUrl}>{children}</ImgproxyProvider>;
    }

    return (
        <NuqsAdapter>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <QueryClientProvider client={queryClient}>{content}</QueryClientProvider>
            </ThemeProvider>
        </NuqsAdapter>
    );
}
