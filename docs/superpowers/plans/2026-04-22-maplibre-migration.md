# MapLibre GL Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace mapbox-gl with maplibre-gl as the map rendering engine in apps/web, keeping Mapbox tile styles.

**Architecture:** Swap the mapbox-gl dependency for maplibre-gl, upgrade react-map-gl from v7 to v8 using the `/maplibre` sub-path, and adapt the token-passing mechanism from the `mapboxAccessToken` prop to `transformRequest` + style URL embedding.

**Tech Stack:** maplibre-gl 5.x, react-map-gl 8.x, Next.js (Pages Router), TypeScript

---

## File Structure

No new files created. All changes are modifications to existing files:

| File | Change Type | Responsibility |
|---|---|---|
| `apps/web/package.json` | Modify | Swap dependencies |
| `apps/web/src/pages/_app.tsx` | Modify | CSS import path |
| `apps/web/src/components/pages/map/MapComponent.tsx` | Modify | Core map component — import path, token handling, style URL |
| `apps/web/src/components/pages/map/MapCreateSpot/MapCreateSpotForm.tsx` | Modify | Replace direct mapbox-gl usage with maplibre-gl |
| `apps/web/src/components/pages/map/MapContainer.tsx` | Modify | Import path only |
| `apps/web/src/components/pages/map/MapSpotOverview/MapSpotOverview.tsx` | Modify | Import path only |
| `apps/web/src/components/pages/map/marker/SpotMarker/SpotMarker.tsx` | Modify | Import path only |
| `apps/web/src/components/pages/map/marker/SpotCluster.tsx` | Modify | Import path only |
| `apps/web/src/components/pages/map/layers/SmallLayer.tsx` | Modify | Import path only |
| `apps/web/src/components/pages/map/layers/SpotPinLayer.tsx` | Modify | Import path only |
| `apps/web/src/components/pages/map/mapQuickAccess/City.tsx` | Modify | Import path only |
| `apps/web/src/components/pages/map/MapNavigation/MapSearch/MapSearchResults/MapSearchResults.tsx` | Modify | Import path only |
| `apps/web/src/components/pages/map/MapCustom/panel/Content.tsx` | Modify | Import path only |
| `apps/web/src/components/pages/map/media/MapMediaOverlay.tsx` | Modify | Import path only |
| `apps/web/src/lib/hook/useSpotsGeoJSON.ts` | Modify | Import path only |

---

### Task 1: Swap dependencies in package.json

**Files:**
- Modify: `apps/web/package.json`

- [ ] **Step 1: Remove mapbox-gl and @types/mapbox-gl, add maplibre-gl, upgrade react-map-gl**

Run from repo root:

```bash
cd apps/web && bun remove mapbox-gl @types/mapbox-gl && bun add maplibre-gl@^5.23.0 && bun add react-map-gl@^8.1.1
```

- [ ] **Step 2: Verify package.json has correct dependencies**

Check that `apps/web/package.json` contains:
- `"maplibre-gl"` in `dependencies` (^5.23.0 or similar)
- `"react-map-gl"` in `dependencies` (^8.1.1 or similar)
- No `"mapbox-gl"` in `dependencies`
- No `"@types/mapbox-gl"` in `devDependencies`

Run:

```bash
cd apps/web && cat package.json | grep -E "mapbox|maplibre|react-map-gl"
```

Expected: Only `maplibre-gl` and `react-map-gl` lines, no `mapbox-gl`.

- [ ] **Step 3: Commit**

```bash
git add apps/web/package.json bun.lock
git commit -m "chore: swap mapbox-gl for maplibre-gl, upgrade react-map-gl to v8"
```

---

### Task 2: Update CSS import in _app.tsx

**Files:**
- Modify: `apps/web/src/pages/_app.tsx:12`

- [ ] **Step 1: Replace the CSS import**

Change line 12 from:

```ts
import 'mapbox-gl/dist/mapbox-gl.css';
```

to:

```ts
import 'maplibre-gl/dist/maplibre-gl.css';
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/pages/_app.tsx
git commit -m "chore: switch CSS import from mapbox-gl to maplibre-gl"
```

---

### Task 3: Migrate MapComponent.tsx (core map + token handling)

**Files:**
- Modify: `apps/web/src/components/pages/map/MapComponent.tsx:1-104`

- [ ] **Step 1: Update the import**

Change line 3 from:

```ts
import ReactMapGL, { GeolocateControl, MapRef, NavigationControl, Source, ViewStateChangeEvent } from 'react-map-gl';
```

to:

```ts
import ReactMapGL, { GeolocateControl, MapRef, NavigationControl, Source, ViewStateChangeEvent } from 'react-map-gl/maplibre';
```

- [ ] **Step 2: Add the token constant**

Add after the existing imports (after line 19):

```ts
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
```

- [ ] **Step 3: Replace mapboxAccessToken and mapStyle props**

In the `<ReactMapGL>` JSX (around lines 93-103), replace:

```tsx
<ReactMapGL
    ref={mapRef}
    {...viewport}
    style={{ width: '100%', height: '100%' }}
    minZoom={MIN_ZOOM_LEVEL}
    maxZoom={MAX_ZOOM_LEVEL}
    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
    mapStyle={`mapbox://styles/mapbox/${mapStyle}`}
    projection={{ name: 'mercator' }}
    onMove={onViewportChange}
    onLoad={onLoad}
>
```

with:

```tsx
<ReactMapGL
    ref={mapRef}
    {...viewport}
    style={{ width: '100%', height: '100%' }}
    minZoom={MIN_ZOOM_LEVEL}
    maxZoom={MAX_ZOOM_LEVEL}
    mapStyle={`https://api.mapbox.com/styles/v1/mapbox/${mapStyle}?access_token=${MAPBOX_TOKEN}`}
    transformRequest={(url: string, _resourceType?: string) => {
        if (url.includes('api.mapbox.com') || url.includes('tiles.mapbox.com')) {
            return {
                url: url.includes('?')
                    ? `${url}&access_token=${MAPBOX_TOKEN}`
                    : `${url}?access_token=${MAPBOX_TOKEN}`,
            };
        }
        return { url };
    }}
    projection={{ name: 'mercator' }}
    onMove={onViewportChange}
    onLoad={onLoad}
>
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/pages/map/MapComponent.tsx
git commit -m "feat: migrate MapComponent to maplibre-gl with Mapbox tile auth"
```

---

### Task 4: Migrate MapCreateSpotForm.tsx (direct mapbox-gl usage)

**Files:**
- Modify: `apps/web/src/components/pages/map/MapCreateSpot/MapCreateSpotForm.tsx:3-5,47,57`

- [ ] **Step 1: Update imports**

Change line 3 from:

```ts
import mapboxgl, { MapLayerMouseEvent } from 'mapbox-gl';
```

to:

```ts
import maplibregl, { MapLayerMouseEvent } from 'maplibre-gl';
```

Change line 5 from:

```ts
import { useMap } from 'react-map-gl';
```

to:

```ts
import { useMap } from 'react-map-gl/maplibre';
```

- [ ] **Step 2: Update Marker type annotation**

Change line 47 from:

```ts
let newSpotMaker: mapboxgl.Marker | null = null;
```

to:

```ts
let newSpotMaker: maplibregl.Marker | null = null;
```

- [ ] **Step 3: Update Marker constructor**

Change line 57 from:

```ts
newSpotMaker = new mapboxgl.Marker(el)
```

to:

```ts
newSpotMaker = new maplibregl.Marker({ element: el })
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/pages/map/MapCreateSpot/MapCreateSpotForm.tsx
git commit -m "feat: migrate MapCreateSpotForm to maplibre-gl"
```

---

### Task 5: Update import paths in remaining 11 files

All of these files only need the import path changed from `'react-map-gl'` to `'react-map-gl/maplibre'`. No other code changes.

**Files:**
- Modify: `apps/web/src/components/pages/map/MapContainer.tsx:6`
- Modify: `apps/web/src/components/pages/map/MapSpotOverview/MapSpotOverview.tsx:3`
- Modify: `apps/web/src/components/pages/map/marker/SpotMarker/SpotMarker.tsx:3`
- Modify: `apps/web/src/components/pages/map/marker/SpotCluster.tsx:2`
- Modify: `apps/web/src/components/pages/map/layers/SmallLayer.tsx:2`
- Modify: `apps/web/src/components/pages/map/layers/SpotPinLayer.tsx:3`
- Modify: `apps/web/src/components/pages/map/mapQuickAccess/City.tsx:2`
- Modify: `apps/web/src/components/pages/map/MapNavigation/MapSearch/MapSearchResults/MapSearchResults.tsx:2`
- Modify: `apps/web/src/components/pages/map/MapCustom/panel/Content.tsx:1`
- Modify: `apps/web/src/components/pages/map/media/MapMediaOverlay.tsx:2`
- Modify: `apps/web/src/lib/hook/useSpotsGeoJSON.ts:2`

- [ ] **Step 1: Update MapContainer.tsx**

Change line 6 from:

```ts
import { MapRef } from 'react-map-gl';
```

to:

```ts
import { MapRef } from 'react-map-gl/maplibre';
```

- [ ] **Step 2: Update MapSpotOverview.tsx**

Change line 3 from:

```ts
import { Popup } from 'react-map-gl';
```

to:

```ts
import { Popup } from 'react-map-gl/maplibre';
```

- [ ] **Step 3: Update SpotMarker.tsx**

Change line 3 from:

```ts
import { Marker, MarkerProps } from 'react-map-gl';
```

to:

```ts
import { Marker, MarkerProps } from 'react-map-gl/maplibre';
```

- [ ] **Step 4: Update SpotCluster.tsx**

Change line 2 from:

```ts
import { Marker } from 'react-map-gl';
```

to:

```ts
import { Marker } from 'react-map-gl/maplibre';
```

- [ ] **Step 5: Update SmallLayer.tsx**

Change line 2 from:

```ts
import { Layer, MapLayerMouseEvent, useMap } from 'react-map-gl';
```

to:

```ts
import { Layer, MapLayerMouseEvent, useMap } from 'react-map-gl/maplibre';
```

- [ ] **Step 6: Update SpotPinLayer.tsx**

Change line 3 from:

```ts
import { Layer, MapLayerMouseEvent, useMap } from 'react-map-gl';
```

to:

```ts
import { Layer, MapLayerMouseEvent, useMap } from 'react-map-gl/maplibre';
```

- [ ] **Step 7: Update City.tsx**

Change line 2 from:

```ts
import { useMap } from 'react-map-gl';
```

to:

```ts
import { useMap } from 'react-map-gl/maplibre';
```

- [ ] **Step 8: Update MapSearchResults.tsx**

Change line 2 from:

```ts
import { useMap } from 'react-map-gl';
```

to:

```ts
import { useMap } from 'react-map-gl/maplibre';
```

- [ ] **Step 9: Update Content.tsx**

Change line 1 from:

```ts
import { useMap } from 'react-map-gl';
```

to:

```ts
import { useMap } from 'react-map-gl/maplibre';
```

- [ ] **Step 10: Update MapMediaOverlay.tsx**

Change line 2 from:

```ts
import { useMap } from 'react-map-gl';
```

to:

```ts
import { useMap } from 'react-map-gl/maplibre';
```

- [ ] **Step 11: Update useSpotsGeoJSON.ts**

Change line 2 from:

```ts
import { MapRef } from 'react-map-gl';
```

to:

```ts
import { MapRef } from 'react-map-gl/maplibre';
```

- [ ] **Step 12: Commit**

```bash
git add apps/web/src/components/pages/map/MapContainer.tsx \
  apps/web/src/components/pages/map/MapSpotOverview/MapSpotOverview.tsx \
  apps/web/src/components/pages/map/marker/SpotMarker/SpotMarker.tsx \
  apps/web/src/components/pages/map/marker/SpotCluster.tsx \
  apps/web/src/components/pages/map/layers/SmallLayer.tsx \
  apps/web/src/components/pages/map/layers/SpotPinLayer.tsx \
  apps/web/src/components/pages/map/mapQuickAccess/City.tsx \
  apps/web/src/components/pages/map/MapNavigation/MapSearch/MapSearchResults/MapSearchResults.tsx \
  apps/web/src/components/pages/map/MapCustom/panel/Content.tsx \
  apps/web/src/components/pages/map/media/MapMediaOverlay.tsx \
  apps/web/src/lib/hook/useSpotsGeoJSON.ts
git commit -m "chore: update all react-map-gl imports to react-map-gl/maplibre"
```

---

### Task 6: Build verification

**Files:** None (verification only)

- [ ] **Step 1: Run the web app build**

```bash
bun run build:web
```

Expected: Build succeeds with no TypeScript errors. If there are type errors, they will be related to the migration and need to be fixed before proceeding.

- [ ] **Step 2: Check for any remaining mapbox-gl references**

```bash
grep -r "from 'mapbox-gl'" apps/web/src/ || echo "No mapbox-gl imports found"
grep -r "from \"mapbox-gl\"" apps/web/src/ || echo "No mapbox-gl imports found"
```

Expected: No results. All imports should now reference `maplibre-gl` or `react-map-gl/maplibre`.

- [ ] **Step 3: Check for any remaining bare react-map-gl imports**

```bash
grep -rn "from 'react-map-gl'" apps/web/src/ | grep -v "react-map-gl/maplibre" || echo "All imports use /maplibre subpath"
```

Expected: No results. All react-map-gl imports should use the `/maplibre` subpath.
