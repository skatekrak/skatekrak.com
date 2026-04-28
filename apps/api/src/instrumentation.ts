import { env } from './env';

// Guard: skip OTel setup entirely if no endpoint is configured
if (!env.OTEL_EXPORTER_OTLP_ENDPOINT) {
    console.log('[otel] OTEL_EXPORTER_OTLP_ENDPOINT not set — telemetry disabled');
} else {
    const { NodeSDK } = await import('@opentelemetry/sdk-node');
    const { resourceFromAttributes } = await import('@opentelemetry/resources');
    const { ATTR_SERVICE_NAME } = await import('@opentelemetry/semantic-conventions');
    const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-proto');
    const { OTLPMetricExporter } = await import('@opentelemetry/exporter-metrics-otlp-proto');
    const { OTLPLogExporter } = await import('@opentelemetry/exporter-logs-otlp-proto');
    const { PeriodicExportingMetricReader } = await import('@opentelemetry/sdk-metrics');
    const { BatchLogRecordProcessor } = await import('@opentelemetry/sdk-logs');
    const { HttpInstrumentation } = await import('@opentelemetry/instrumentation-http');
    const { UndiciInstrumentation } = await import('@opentelemetry/instrumentation-undici');
    const { PrismaInstrumentation } = await import('@prisma/instrumentation');

    const endpoint = env.OTEL_EXPORTER_OTLP_ENDPOINT;

    const resource = resourceFromAttributes({
        [ATTR_SERVICE_NAME]: env.OTEL_SERVICE_NAME,
        'deployment.environment.name': env.OTEL_ENVIRONMENT,
    });

    const sdk = new NodeSDK({
        resource,
        traceExporter: new OTLPTraceExporter({ url: `${endpoint}/v1/traces` }),
        metricReader: new PeriodicExportingMetricReader({
            exporter: new OTLPMetricExporter({ url: `${endpoint}/v1/metrics` }),
            exportIntervalMillis: 60_000,
        }),
        logRecordProcessors: [new BatchLogRecordProcessor(new OTLPLogExporter({ url: `${endpoint}/v1/logs` }))],
        instrumentations: [new HttpInstrumentation(), new UndiciInstrumentation(), new PrismaInstrumentation()],
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

    // Graceful shutdown: flush pending telemetry before exit
    const shutdown = async () => {
        console.log('[otel] Shutting down...');
        await sdk.shutdown().catch((err) => console.error('[otel] Shutdown error', err));
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}
