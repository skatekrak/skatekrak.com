export async function register() {
    // Only run on the server (not edge runtime)
    if (typeof window !== 'undefined') return;

    // Skip during build — HttpInstrumentation patches break SSG prerendering
    if (process.env.NEXT_PHASE === 'phase-production-build') return;

    const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
    if (!endpoint) {
        console.log('[otel] OTEL_EXPORTER_OTLP_ENDPOINT not set — telemetry disabled');
        return;
    }

    const { NodeSDK } = await import('@opentelemetry/sdk-node');
    const { resourceFromAttributes } = await import('@opentelemetry/resources');
    const { ATTR_SERVICE_NAME } = await import('@opentelemetry/semantic-conventions');
    const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-proto');
    const { OTLPMetricExporter } = await import('@opentelemetry/exporter-metrics-otlp-proto');
    const { PeriodicExportingMetricReader } = await import('@opentelemetry/sdk-metrics');
    const { HttpInstrumentation } = await import('@opentelemetry/instrumentation-http');
    const { UndiciInstrumentation } = await import('@opentelemetry/instrumentation-undici');

    const serviceName = process.env.OTEL_SERVICE_NAME ?? 'krak-web';
    const environment = process.env.OTEL_ENVIRONMENT ?? 'production';

    const resource = resourceFromAttributes({
        [ATTR_SERVICE_NAME]: serviceName,
        'deployment.environment.name': environment,
    });

    const sdk = new NodeSDK({
        resource,
        traceExporter: new OTLPTraceExporter({ url: `${endpoint}/v1/traces` }),
        metricReader: new PeriodicExportingMetricReader({
            exporter: new OTLPMetricExporter({ url: `${endpoint}/v1/metrics` }),
            exportIntervalMillis: 60_000,
        }),
        instrumentations: [new HttpInstrumentation(), new UndiciInstrumentation()],
    });

    try {
        sdk.start();
        console.log(`[otel] Telemetry enabled → ${endpoint}`);
    } catch (err) {
        console.error('[otel] Failed to start SDK, continuing without telemetry', err);
    }

    // Connectivity check — fire-and-forget, doesn't block startup
    fetch(`${endpoint}/v1/traces`, { method: 'POST', body: '{}' })
        .then((res) => console.log(`[otel] Collector reachable (HTTP ${res.status})`))
        .catch((err) => console.error(`[otel] Collector unreachable at ${endpoint} —`, err.message));
}
