import ReactGA from 'react-ga';

class Analytics {
    public static init(trackingCode: string) {
        ReactGA.initialize(trackingCode);
    }

    public static trackPageView(name?: string) {
        const pageName = name ? name : window.document.title;
        ReactGA.set({ page: pageName });
        ReactGA.pageview(window.location.pathname);
    }

    public static trackEvent(category?: string, action?: string, value?: any) {
        if (category && action) {
            ReactGA.event({ category, action, value });
        }
    }
}

export default Analytics;
