# OpenTelemetry Integration for @krak/web → SigNoz

**Date:** 2026-04-28
**Status:** Approved

## Summary

Add OpenTelemetry to `@krak/web` (Next.js 16, Pages Router) for both server-side and browser-side tracing, exporting to a self-hosted SigNoz instance. Traces are linked with `@krak/api` via W3C Trace Context propagation (`traceparent` headers), enabling end-to-end distributed tracing from browser → Next.js SSR → API → database.

## Signals

- **Server-side traces**: SSR renders, `getServerSideProps`, outgoing HTTP calls to the API
- **Server-side metrics**: Default Node.js runtime metrics (CPU, memory)
- **Browser traces**: Page load timing (document load), client-side `fetch()` calls to the API with trace context propagation
- **No logs**: Next.js uses console.log which is removed in production via SWC (`removeConsole: true` in next.config.js)

## Architecture

### Server-side: Next.js `instrumentation.ts` hook

Next.js 16 supports an `src/instrumentation.ts` file with a `register()` export that runs once when the server starts. This initializes the OTel `NodeSDK`.

**What it configures:**
- **Exporters**: OTLP/HTTP protobuf for traces and metrics
- **Auto-instrumentations**: `HttpInstrumentation` (incoming + outgoing requests), `UndiciInstrumentation` (fetch)
- **Resource**: `service.name = "krak-web"`, `deployment.environment` from env
- **Guard clause**: Only initializes when `OTEL_EXPORTER_OTLP_ENDPOINT` is set
- **Trace propagation**: `HttpInstrumentation` automatically injects `traceparent` headers on outgoing `fetch()` calls from `getServerSideProps` → API

### Browser-side: OTel Web SDK

A `src/lib/otel-browser.ts` module initializes the browser OTel SDK:

- **`WebTracerProvider`** with `BatchSpanProcessor` + `OTLPTraceExporter` (HTTP/JSON)
- **`FetchInstrumentation`**: Wraps `window.fetch()`, adds `traceparent` to oRPC calls
- **`DocumentLoadInstrumentation`**: Page load timing (navigation, DOM loaded, load event)
- **Resource**: `service.name = "krak-web-browser"`
- **Propagator**: `W3CTraceContextPropagator`
- **URL filter**: Only propagate trace context to `NEXT_PUBLIC_KRAK_API_URL` origin, not third parties
- **Exporter target**: `/api/otel` (server-side proxy, not direct to collector)

Called from `_app.tsx` via `useEffect` on mount. Only active when `NEXT_PUBLIC_OTEL_ENABLED` is `"true"`.

### Proxy route: `/api/otel`

A Next.js API route (`src/pages/api/otel.ts`) that receives browser OTLP trace payloads and forwards them to the internal OTel collector:

- `POST /api/otel` → forwards request body to `${OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`
- Validates method (POST only) and content type
- No authentication needed (same-origin requests from the browser)

This keeps the collector on the private network — no public exposure needed.

## Trace Linking

W3C Trace Context propagation links traces across all three services:

```
Browser (krak-web-browser)          Next.js SSR (krak-web)            API (krak-api)
─────────────────────────          ────────────────────────           ──────────────
User clicks spot                   
  → fetch /rpc/spots.get           
    [traceparent: 00-abc...]  ───────────────────────────────────→  Continues trace abc
                                                                    → Prisma query span

User loads page (SSR)              getServerSideProps
                                     → fetch /rpc/spots.get
                                       [traceparent: 00-def...]  →  Continues trace def
                                                                    → Prisma query span
```

The API's existing `HttpInstrumentation` + `UndiciInstrumentation` already extract incoming `traceparent` headers, so no API changes are needed.

## Environment Variables

| Variable | Required | Default | Scope | Description |
|---|---|---|---|---|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | No | — | Server runtime | Collector URL (e.g. `http://otel-collector:4318`). OTel disabled when unset. |
| `OTEL_SERVICE_NAME` | No | `krak-web` | Server runtime | Service name in SigNoz. |
| `OTEL_ENVIRONMENT` | No | `production` | Server runtime | `deployment.environment` resource attribute. |
| `NEXT_PUBLIC_OTEL_ENABLED` | No | — | Build-time | Set to `"true"` to enable browser-side OTel. |

Server-side vars are runtime only (not `NEXT_PUBLIC_`). `NEXT_PUBLIC_OTEL_ENABLED` is build-time since the browser SDK code needs to be tree-shaken when disabled.

## Dependencies

### Server-side (same as API)

```
@opentelemetry/sdk-node
@opentelemetry/api
@opentelemetry/exporter-trace-otlp-proto
@opentelemetry/exporter-metrics-otlp-proto
@opentelemetry/sdk-metrics
@opentelemetry/instrumentation-http
@opentelemetry/instrumentation-undici
@opentelemetry/resources
@opentelemetry/semantic-conventions
```

### Browser-side

```
@opentelemetry/sdk-trace-web
@opentelemetry/sdk-trace-base
@opentelemetry/exporter-trace-otlp-http
@opentelemetry/instrumentation-fetch
@opentelemetry/instrumentation-document-load
@opentelemetry/context-zone
```

## Next.js Configuration

`next.config.js` needs `serverExternalPackages` to prevent Next.js from bundling the OTel Node.js SDK packages (they use native modules and dynamic requires that don't work with webpack):

```js
serverExternalPackages: [
    '@opentelemetry/sdk-node',
    '@opentelemetry/instrumentation-http',
    '@opentelemetry/instrumentation-undici',
],
```

## Files Changed

| File | Change |
|---|---|
| `apps/web/src/instrumentation.ts` | **New** — Next.js server OTel setup (`register()` export) |
| `apps/web/src/lib/otel-browser.ts` | **New** — Browser OTel SDK initialization |
| `apps/web/src/pages/api/otel.ts` | **New** — Proxy route for browser → collector |
| `apps/web/src/pages/_app.tsx` | Add browser OTel init call on mount |
| `apps/web/package.json` | Add OTel dependencies |
| `apps/web/next.config.js` | Add `serverExternalPackages` for OTel |
| `apps/web/Dockerfile` | No changes needed (standalone mode handles everything) |

## Deployment

- **Docker/Dokploy**: Set `OTEL_EXPORTER_OTLP_ENDPOINT` and `NEXT_PUBLIC_OTEL_ENABLED=true` (at build time for the browser flag)
- **Vercel**: Leave env vars unset — OTel is completely disabled
- **Local dev**: Disabled by default (no env vars set)

## Out of Scope

- Browser error tracking (use a dedicated tool like Sentry for that)
- Custom browser performance metrics (Web Vitals, etc.)
- Instrumenting Meilisearch, Mapbox, or other third-party client-side calls
- Server-side log export (console.log is stripped in production builds)
- Changes to `@krak/api` (already instrumented)
