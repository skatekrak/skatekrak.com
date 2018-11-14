declare global {
    // tslint:disable-next-line:interface-name
    interface Window {
        _paq: any[];
    }
}

class Analytics {
    private previousPath?: string = null;

    public push(args: any[]): void {
        window._paq.push(args);
    }

    public setUserId(userId: string): void {
        this.push(['setUserId', userId]);
    }

    public resetUserId(): void {
        this.push(['resetUserId']);
    }

    public trackPageView(name?: string): void {
        const current = window.document.documentURI;
        if (current === this.previousPath) {
            return;
        }
        this.push(['setCustomUrl', current]);
        this.push(['setDocumentTitle', document.domain + '/' + name]);
        this.push(['deleteCustomVariables', 'page']);
        if (this.previousPath) {
            this.push(['setGenerationTimeMs', 0]);
        }
        this.push(['trackPageView']);
        this.push(['enableLinkTracking']);
        this.previousPath = current;
    }

    public trackEvent(category: string, action: string, opt?: { name?: string; value?: number }): void {
        const event: any[] = ['trackEvent', category, action];
        if (opt) {
            if (opt.name) {
                event.push(opt.name);
            }
            if (opt.value) {
                if (!opt.name) {
                    event.push('');
                }
                event.push(opt.value);
            }
        }
        this.push(event);
    }

    public trackOrder(orderId, grandTotal): void {
        const event: any[] = ['trackEcommerceOrder', orderId, grandTotal];
        this.push(event);
    }
}

const analytics = new Analytics();

export default analytics;
