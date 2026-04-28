import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import { Writable } from 'node:stream';

const pinoLevelToSeverity: Record<number, SeverityNumber> = {
    10: SeverityNumber.TRACE,
    20: SeverityNumber.DEBUG,
    30: SeverityNumber.INFO,
    40: SeverityNumber.WARN,
    50: SeverityNumber.ERROR,
    60: SeverityNumber.FATAL,
};

/**
 * Returns a writable stream that forwards pino JSON log lines to the
 * OpenTelemetry LoggerProvider (set up by instrumentation.ts).
 *
 * Runs in the main thread — no worker threads / thread-stream needed.
 */
export function otelLogStream(): Writable {
    const logger = logs.getLogger('pino');

    return new Writable({
        write(chunk: Buffer, _encoding, callback) {
            try {
                const record = JSON.parse(chunk.toString());
                logger.emit({
                    severityNumber: pinoLevelToSeverity[record.level] ?? SeverityNumber.INFO,
                    severityText: record.level != null ? String(record.level) : 'INFO',
                    body: record.msg ?? '',
                    attributes: record,
                    timestamp: record.time
                        ? [Math.floor(record.time / 1000), (record.time % 1000) * 1_000_000]
                        : undefined,
                });
            } catch {
                // Silently ignore malformed log lines — don't break the app for telemetry
            }
            callback();
        },
    });
}
