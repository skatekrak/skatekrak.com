declare global {
    interface Window {
        umami?: {
            track: (eventName: string, eventData?: Record<string, unknown>) => void;
        };
    }
}

export function trackEvent(category?: string, action?: string, value?: unknown) {
    if (category && action && typeof window !== 'undefined' && window.umami) {
        window.umami.track(category, { action, value });
    }
}
