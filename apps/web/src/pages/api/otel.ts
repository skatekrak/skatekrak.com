import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Proxy route that forwards browser OTLP trace payloads to the internal
 * OTel collector. This keeps the collector on the private network.
 *
 * POST /api/otel → forwards to ${OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
    if (!endpoint) {
        return res.status(503).json({ error: 'OTel collector not configured' });
    }

    try {
        const response = await fetch(`${endpoint}/v1/traces`, {
            method: 'POST',
            headers: { 'Content-Type': req.headers['content-type'] ?? 'application/json' },
            body: JSON.stringify(req.body),
        });

        return res.status(response.status).end();
    } catch {
        return res.status(502).json({ error: 'Failed to forward traces to collector' });
    }
}
