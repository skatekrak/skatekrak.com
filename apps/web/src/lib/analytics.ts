import va from '@vercel/analytics';

class Analytics {
    public static trackEvent(category?: string, action?: string, value?: any) {
        if (category && action) {
            va.track(category, { action, value });
        }
    }
}

export default Analytics;
