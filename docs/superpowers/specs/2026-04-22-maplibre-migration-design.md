# Migrate from Mapbox GL to MapLibre GL

**Date:** 2026-04-22
**Scope:** `apps/web` only
**Motivation:** Avoid vendor lock-in by switching to the open-source MapLibre GL renderer. Mapbox tile styles are retained via token.

## Summary

Replace `mapbox-gl` with `maplibre-gl` as the WebGL map rendering engine in `apps/web`. Upgrade `react-map-gl` from v7 to v8, which has first-class MapLibre support via the `react-map-gl/maplibre` sub-path. Continue using Mapbox-hosted tile styles (`dark-v11`, `satellite-streets-v11`) with the existing `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`.

## Dependency Changes

### Remove

| Package | Current Version |
|---|---|
| `mapbox-gl` | ^2.15.0 |
| `@types/mapbox-gl` | ^2.7.13 |

### Add

| Package | Version |
|---|---|
| `maplibre-gl` | ^5.23.0 |

### Upgrade

| Package | From | To |
|---|---|---|
| `react-map-gl` | ^7.0.25 | ^8.1.1 |

`maplibre-gl` ships its own TypeScript types, so `@types/mapbox-gl` is no longer needed.

## Files to Modify

### 1. `apps/web/package.json`

Swap dependencies as described above.

### 2. `apps/web/src/pages/_app.tsx` (line 12)

```diff
- import 'mapbox-gl/dist/mapbox-gl.css';
+ import 'maplibre-gl/dist/maplibre-gl.css';
```

### 3. `apps/web/src/components/pages/map/MapComponent.tsx`

This is the core change. The `mapboxAccessToken` prop does not exist on the MapLibre entry point. Instead, the token is embedded in the style URL and appended to tile requests via `transformRequest`.

```diff
- import ReactMapGL, { GeolocateControl, MapRef, NavigationControl, Source, ViewStateChangeEvent } from 'react-map-gl';
+ import ReactMapGL, { GeolocateControl, MapRef, NavigationControl, Source, ViewStateChangeEvent } from 'react-map-gl/maplibre';

+ const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  <ReactMapGL
-     mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
-     mapStyle={`mapbox://styles/mapbox/${mapStyle}`}
+     mapStyle={`https://api.mapbox.com/styles/v1/mapbox/${mapStyle}?access_token=${MAPBOX_TOKEN}`}
+     transformRequest={(url: string, _resourceType?: string) => {
+         if (url.includes('api.mapbox.com') || url.includes('tiles.mapbox.com')) {
+             return {
+                 url: url.includes('?')
+                     ? `${url}&access_token=${MAPBOX_TOKEN}`
+                     : `${url}?access_token=${MAPBOX_TOKEN}`,
+             };
+         }
+         return { url };
+     }}
  />
```

### 4. `apps/web/src/components/pages/map/MapCreateSpot/MapCreateSpotForm.tsx`

Replace direct `mapbox-gl` usage with `maplibre-gl`:

```diff
- import mapboxgl, { MapLayerMouseEvent } from 'mapbox-gl';
+ import maplibregl, { MapLayerMouseEvent } from 'maplibre-gl';
- import { useMap } from 'react-map-gl';
+ import { useMap } from 'react-map-gl/maplibre';

  // Line 47: type annotation
- let newSpotMaker: mapboxgl.Marker | null = null;
+ let newSpotMaker: maplibregl.Marker | null = null;

  // Line 57: constructor — MapLibre uses options object for element
- newSpotMaker = new mapboxgl.Marker(el)
+ newSpotMaker = new maplibregl.Marker({ element: el })
```

### 5. Import path changes (10 files)

All change from `'react-map-gl'` to `'react-map-gl/maplibre'`. No other changes needed in these files:

| File | Imports |
|---|---|
| `MapContainer.tsx` | `MapRef` |
| `MapSpotOverview/MapSpotOverview.tsx` | `Popup` |
| `marker/SpotMarker/SpotMarker.tsx` | `Marker`, `MarkerProps` |
| `marker/SpotCluster.tsx` | `Marker` |
| `layers/SmallLayer.tsx` | `Layer`, `MapLayerMouseEvent`, `useMap` |
| `layers/SpotPinLayer.tsx` | `Layer`, `MapLayerMouseEvent`, `useMap` |
| `mapQuickAccess/City.tsx` | `useMap` |
| `MapNavigation/MapSearch/MapSearchResults/MapSearchResults.tsx` | `useMap` |
| `MapCustom/panel/Content.tsx` | `useMap` |
| `media/MapMediaOverlay.tsx` | `useMap` |

### 6. Type-only import (1 file)

| File | Imports |
|---|---|
| `lib/hook/useSpotsGeoJSON.ts` | `MapRef` |

Change from `'react-map-gl'` to `'react-map-gl/maplibre'`.

## Type Compatibility

All types used in the codebase are unchanged between react-map-gl v7 and v8:

- `MapRef` — same
- `ViewStateChangeEvent` — same
- `MapLayerMouseEvent` — same (also available from `maplibre-gl` directly)
- `MarkerProps` — same

Types that were renamed in v8 (`FillLayer` → `FillLayerSpecification`, `MapStyle` → `StyleSpecification`, etc.) are not used anywhere in the codebase.

## Environment Variables

`NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` remains required. It is still needed to authenticate tile requests to Mapbox's API. No changes to `.env`, Dockerfile, or CI workflows.

## What Does NOT Change

- Map styles (`dark-v11`, `satellite-streets-v11`) — MapLibre renders Mapbox vector tiles
- All component logic (markers, layers, popups, controls, viewport state)
- Zustand/Redux stores
- GeoJSON data pipeline
- `nuqs` query state hooks for viewport/style

## Risk Assessment

| Area | Risk | Notes |
|---|---|---|
| Import path swap (10 files) | Low | Mechanical find-and-replace, API is identical |
| `transformRequest` for Mapbox tiles | Medium | Must verify that style JSON, vector tiles, sprites, and glyph requests all get the token. Test both `dark-v11` and `satellite-streets-v11` styles. |
| `maplibregl.Marker` constructor | Low | Only change is `{ element: el }` vs positional arg |
| `projection` prop | Low | MapLibre supports `{ name: 'mercator' }` natively |

## Verification

1. `bun run build:web` passes with no type errors
2. Map loads with `dark-v11` style — tiles, sprites, and glyphs all render
3. Switching to `satellite-streets-v11` works
4. Spot markers render correctly at zoom levels above `ZOOM_DISPLAY_DOTS`
5. Dot/circle layers render at zoom levels below `ZOOM_DISPLAY_DOTS`
6. Clicking a dot cluster zooms in
7. Clicking a spot pin opens the spot overview popup
8. Create spot flow works: click to place pin, marker appears
9. Navigation and geolocate controls function
10. `flyTo` calls work (search results, city quick access, custom map panels)
