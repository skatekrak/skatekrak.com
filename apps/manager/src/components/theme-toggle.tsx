'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from '@krak/ui';

const themes = ['light', 'dark', 'system'] as const;

const themeIcons: Record<string, typeof Sun> = {
    light: Sun,
    dark: Moon,
    system: Monitor,
};

const themeLabels: Record<string, string> = {
    light: 'Light mode',
    dark: 'Dark mode',
    system: 'System theme',
};

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                <Sun className="h-4 w-4" />
            </Button>
        );
    }

    const currentTheme = theme ?? 'system';
    const currentIndex = themes.indexOf(currentTheme as (typeof themes)[number]);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    const Icon = themeIcons[currentTheme] ?? Monitor;

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(nextTheme)}
            title={`${themeLabels[currentTheme]} — click for ${themeLabels[nextTheme]?.toLowerCase()}`}
        >
            <Icon className="h-4 w-4" />
            <span className="sr-only">{themeLabels[currentTheme]}</span>
        </Button>
    );
}
