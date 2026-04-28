import { ZoneContextManager } from '@opentelemetry/context-zone';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

let initialized = false;

/**
 * Initialize OpenTelemetry in the browser.
 * Instruments fetch() calls and document load timing.
 * Sends traces to /api/otel (server-side proxy to the OTel collector).
 *
 * Only propagates traceparent headers to the API origin to avoid
 * leaking trace context to third-party services.
 */
export function initBrowserOtel() {
    if (initialized) return;
    initialized = true;

    const apiOrigin = process.env.NEXT_PUBLIC_KRAK_API_URL;
    if (!apiOrigin) return;

    const resource = resourceFromAttributes({
        [ATTR_SERVICE_NAME]: 'krak-web-browser',
    });

    const exporter = new OTLPTraceExporter({
        url: '/api/otel',
    });

    const provider = new WebTracerProvider({
        resource,
        spanProcessors: [new BatchSpanProcessor(exporter)],
    });

    provider.register({
        contextManager: new ZoneContextManager(),
    });

    // Instrument fetch — adds traceparent to outgoing requests to the API
    const fetchInstrumentation = new FetchInstrumentation({
        propagateTraceHeaderCorsUrls: [new RegExp(apiOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))],
        clearTimingResources: true,
    });
    fetchInstrumentation.setTracerProvider(provider);
    fetchInstrumentation.enable();

    // Instrument document load — page load timing
    const docLoadInstrumentation = new DocumentLoadInstrumentation();
    docLoadInstrumentation.setTracerProvider(provider);
    docLoadInstrumentation.enable();
}
