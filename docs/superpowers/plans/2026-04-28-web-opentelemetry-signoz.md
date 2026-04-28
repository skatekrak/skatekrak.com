# Web OpenTelemetry + SigNoz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add OpenTelemetry to `@krak/web` (server + browser) with trace linking to `@krak/api` via W3C Trace Context propagation.

**Architecture:** Server-side uses Next.js's `instrumentation.ts` hook to initialize the OTel NodeSDK. Browser-side uses `@opentelemetry/sdk-trace-web` with fetch and document-load instrumentations. Browser traces are proxied to the collector via a Next.js API route (`/api/otel`) to avoid exposing the collector publicly.

**Tech Stack:** Next.js 16 (Pages Router), `@opentelemetry/sdk-node`, `@opentelemetry/sdk-trace-web`, OTLP/HTTP exporters, W3C Trace Context

**Spec:** `docs/superpowers/specs/2026-04-28-web-opentelemetry-signoz-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `apps/web/src/instrumentation.ts` | Create | Next.js server OTel setup (`register()` export) |
| `apps/web/src/lib/otel-browser.ts` | Create | Browser OTel SDK initialization |
| `apps/web/src/pages/api/otel.ts` | Create | Proxy route forwarding browser traces to collector |
| `apps/web/src/pages/_app.tsx` | Modify | Call browser OTel init on mount |
| `apps/web/package.json` | Modify | Add OTel dependencies |
| `apps/web/next.config.js` | Modify | Add `serverExternalPackages` for OTel |
| `apps/web/Dockerfile` | Modify | Add `NEXT_PUBLIC_OTEL_ENABLED` build arg |

---

### Task 1: Install OTel dependencies

**Files:**
- Modify: `apps/web/package.json`

- [ ] **Step 1: Install server-side OTel packages**

Run from the monorepo root:

```bash
bun add --cwd apps/web \
  @opentelemetry/sdk-node \
  @opentelemetry/api \
  @opentelemetry/exporter-trace-otlp-proto \
  @opentelemetry/exporter-metrics-otlp-proto \
  @opentelemetry/sdk-metrics \
  @opentelemetry/instrumentation-http \
  @opentelemetry/instrumentation-undici \
  @opentelemetry/resources \
  @opentelemetry/semantic-conventions
```

- [ ] **Step 2: Install browser-side OTel packages**

```bash
bun add --cwd apps/web \
  @opentelemetry/sdk-trace-web \
  @opentelemetry/sdk-trace-base \
  @opentelemetry/exporter-trace-otlp-http \
  @opentelemetry/instrumentation-fetch \
  @opentelemetry/instrumentation-document-load \
  @opentelemetry/context-zone
```

- [ ] **Step 3: Verify install**

```bash
bun install
```

Expected: clean install, no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/package.json bun.lock
git commit -m "feat(web): add opentelemetry dependencies"
```

---

### Task 2: Add `serverExternalPackages` to next.config.js

**Files:**
- Modify: `apps/web/next.config.js`

- [ ] **Step 1: Add serverExternalPackages**

Edit `apps/web/next.config.js`. Add `serverExternalPackages` to the config object, after the `output: 'standalone'` line:

```js
module.exports = withBundleAnalyzer({
    output: 'standalone',
    serverExternalPackages: [
        '@opentelemetry/sdk-node',
        '@opentelemetry/instrumentation-http',
        '@opentelemetry/instrumentation-undici',
    ],
    allowedDevOrigins: ['*.skatekrak.com'],
    // ... rest unchanged
```

The full config should look like:

```js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
    output: 'standalone',
    serverExternalPackages: [
        '@opentelemetry/sdk-node',
        '@opentelemetry/instrumentation-http',
        '@opentelemetry/instrumentation-undici',
    ],
    allowedDevOrigins: ['*.skatekrak.com'],
    productionBrowserSourceMaps: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    transpilePackages: ['@krak/auth', '@krak/types', '@krak/contracts', '@krak/ui', '@krak/utils'],
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'dev.skatekrak.com',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/join',
                destination: 'https://buy.stripe.com/4gw02Tbao2Cna5O7ss',
                permanent: true,
            },
            {
                source: '/map/:mapId',
                destination: '/?id=:mapId',
                permanent: false,
            },
            {
                source: '/map',
                destination: '/',
                permanent: true,
            },
        ];
    },
});
```

- [ ] **Step 2: Verify build**

```bash
bun run build:web
```

Expected: build succeeds. The new config key doesn't break anything.

- [ ] **Step 3: Commit**

```bash
git add apps/web/next.config.js
git commit -m "feat(web): add serverExternalPackages for OTel SDK"
```

---

### Task 3: Create server-side `instrumentation.ts`

**Files:**
- Create: `apps/web/src/instrumentation.ts`

- [ ] **Step 1: Write the instrumentation file**

Create `apps/web/src/instrumentation.ts` with the following content:

```typescript
export async function register() {
    // Only run on the server (not edge runtime)
    if (typeof window !== 'undefined') return;

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
```

Key differences from the API's `instrumentation.ts`:
- Exports `register()` function (Next.js convention) instead of top-level execution
- Uses `process.env` directly (no `env.ts` in the web app)
- No Prisma instrumentation (web doesn't talk to DB)
- No log exporter (console.log is stripped in production builds)
- No SIGTERM/SIGINT handlers (Next.js manages its own lifecycle)

- [ ] **Step 2: Verify build**

```bash
bun run build:web
```

Expected: build succeeds. Next.js picks up `src/instrumentation.ts` automatically.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/instrumentation.ts
git commit -m "feat(web): add server-side OTel instrumentation via Next.js register()"
```

---

### Task 4: Create browser-side OTel init

**Files:**
- Create: `apps/web/src/lib/otel-browser.ts`

- [ ] **Step 1: Write the browser OTel initialization**

Create `apps/web/src/lib/otel-browser.ts` with the following content:

```typescript
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
```

Key design decisions:
- Uses static imports (not dynamic) — browser-side, tree-shaking is handled by Next.js/webpack
- `propagateTraceHeaderCorsUrls` restricts `traceparent` injection to the API origin only
- Exports to `/api/otel` which proxies to the real collector (Task 5)
- `ZoneContextManager` provides async context tracking in the browser
- Guard against double-initialization with the `initialized` flag

- [ ] **Step 2: Verify build**

```bash
bun run build:web
```

Expected: build succeeds. The file is not imported yet, so it won't affect the bundle.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/lib/otel-browser.ts
git commit -m "feat(web): add browser-side OTel SDK with fetch + document-load instrumentation"
```

---

### Task 5: Create `/api/otel` proxy route

**Files:**
- Create: `apps/web/src/pages/api/otel.ts`

- [ ] **Step 1: Write the proxy API route**

Create `apps/web/src/pages/api/otel.ts` with the following content:

```typescript
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
```

- [ ] **Step 2: Verify build**

```bash
bun run build:web
```

Expected: build succeeds. The API route compiles as a serverless function.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/pages/api/otel.ts
git commit -m "feat(web): add /api/otel proxy route for browser traces"
```

---

### Task 6: Wire browser OTel into `_app.tsx`

**Files:**
- Modify: `apps/web/src/pages/_app.tsx`

- [ ] **Step 1: Add browser OTel init to _app.tsx**

Edit `apps/web/src/pages/_app.tsx`.

Add this import after the existing imports (after line 11, `import { useSession } from '@/lib/auth';`):

```typescript
import { initBrowserOtel } from '@/lib/otel-browser';
```

Then add a `useEffect` call inside the `App` component, after the `useUmamiIdentify()` call on line 32:

```typescript
    useEffect(() => {
        if (process.env.NEXT_PUBLIC_OTEL_ENABLED === 'true') {
            initBrowserOtel();
        }
    }, []);
```

The full component should look like:

```typescript
const App: React.FC<AppProps> = ({ Component, pageProps }) => {
    const [queryClient] = useState(() => new QueryClient());
    useUmamiIdentify();

    useEffect(() => {
        if (process.env.NEXT_PUBLIC_OTEL_ENABLED === 'true') {
            initBrowserOtel();
        }
    }, []);

    return (
        <NuqsAdapter>
            // ... rest unchanged
```

- [ ] **Step 2: Verify build**

```bash
bun run build:web
```

Expected: build succeeds. When `NEXT_PUBLIC_OTEL_ENABLED` is not `"true"`, the import is included but `initBrowserOtel()` is never called.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/pages/_app.tsx
git commit -m "feat(web): wire browser OTel initialization into _app.tsx"
```

---

### Task 7: Add `NEXT_PUBLIC_OTEL_ENABLED` build arg to Dockerfile

**Files:**
- Modify: `apps/web/Dockerfile`

- [ ] **Step 1: Add the build arg**

Edit `apps/web/Dockerfile`. After the existing `ARG NEXT_PUBLIC_IMGPROXY_URL` line (line 44), add:

```dockerfile
ARG NEXT_PUBLIC_OTEL_ENABLED
```

After the existing `ENV NEXT_PUBLIC_IMGPROXY_URL=...` line (line 52), add:

```dockerfile
ENV NEXT_PUBLIC_OTEL_ENABLED=$NEXT_PUBLIC_OTEL_ENABLED
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/Dockerfile
git commit -m "feat(web): add NEXT_PUBLIC_OTEL_ENABLED build arg to Dockerfile"
```

---

### Task 8: Verify end-to-end

- [ ] **Step 1: Run full build**

```bash
bun run build:web
```

Expected: build succeeds with no errors.

- [ ] **Step 2: Run lint**

```bash
bun run lint
```

Expected: no new lint errors from added files (only pre-existing warnings).

- [ ] **Step 3: Commit any fixes if needed**

```bash
git add -A
git commit -m "fix(web): address lint/build issues from OTel integration"
```
