declare global {
    interface Window {
        umami?: {
            track: (eventName: string, eventData?: Record<string, unknown>) => void;
            identify: (properties: Record<string, unknown>) => void;
        };
    }
}

class Analytics {
    public static trackEvent(category?: string, action?: string, value?: any) {
        if (category && action && typeof window !== 'undefined' && window.umami) {
            window.umami.track(category, { action, value });
        }
    }
}

export default Analytics;
