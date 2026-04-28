import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import { Writable } from 'node:stream';

import type { Attributes } from '@opentelemetry/api';

const pinoLevelToSeverity: Record<number, SeverityNumber> = {
    10: SeverityNumber.TRACE,
    20: SeverityNumber.DEBUG,
    30: SeverityNumber.INFO,
    40: SeverityNumber.WARN,
    50: SeverityNumber.ERROR,
    60: SeverityNumber.FATAL,
};

/** Pino fields that are handled separately and should not appear in attributes. */
const SKIP_KEYS = new Set(['level', 'time', 'msg', 'pid', 'hostname']);

/**
 * Flatten a pino JSON record into OTel-compatible flat attributes.
 * Nested objects are expanded with dot-separated keys (e.g. `request.method`).
 * Values that aren't primitives or arrays of primitives are JSON-stringified.
 */
function flattenAttributes(obj: Record<string, unknown>, prefix = ''): Attributes {
    const attrs: Attributes = {};

    for (const [key, value] of Object.entries(obj)) {
        if (!prefix && SKIP_KEYS.has(key)) continue;

        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (value == null) continue;

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            attrs[fullKey] = value;
        } else if (Array.isArray(value) && value.every((v) => typeof v === 'string' || typeof v === 'number')) {
            attrs[fullKey] = value as (string | number)[];
        } else if (typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(attrs, flattenAttributes(value as Record<string, unknown>, fullKey));
        } else {
            attrs[fullKey] = JSON.stringify(value);
        }
    }

    return attrs;
}

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
                    attributes: flattenAttributes(record),
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
