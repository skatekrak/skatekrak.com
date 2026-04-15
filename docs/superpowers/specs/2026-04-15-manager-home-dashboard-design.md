# Manager Home Dashboard

## Overview

Add a home dashboard to `apps/manager` that displays platform-wide stats and recent activity. The dashboard becomes the landing page (`/`) for admin users, replacing the current redirect to `/users`.

## Scope

Full stack: new API contracts + endpoints in `@krak/contracts` and `apps/api`, plus the dashboard page in `apps/manager`.

## API Layer

### New endpoint: `admin.overview`

Returns aggregate platform counts in a single lightweight call.

- **Input**: `void`
- **Output**: `{ totalUsers: number, totalSpots: number, totalMedia: number, totalClips: number }`
- **Implementation**: `Promise.all` over four `prisma.*.count()` calls
- **Auth**: `authed` + `admin` middleware (same as existing admin endpoints)

### New endpoint: `admin.spots.list`

Paginated admin spot listing, mirrors the existing `admin.users.list` pattern.

- **Input**: `{ page: number, perPage: number, sortBy: 'name' | 'createdAt', sortOrder: 'asc' | 'desc', search?: string }`
- **Output**: `{ spots: AdminSpotSchema[], total: number, page: number, perPage: number }`
- **AdminSpotSchema fields**: `id, name, city, country, type (SHOP|STREET|PARK|DIY|PRIVATE), status (ACTIVE|WIP|RIP), addedBy: { username }, createdAt`
- **Auth**: `authed` + `admin` middleware

### New endpoint: `admin.media.list`

Paginated admin media listing.

- **Input**: `{ page: number, perPage: number, sortBy: 'createdAt', sortOrder: 'asc' | 'desc', type?: 'IMAGE' | 'VIDEO' }`
- **Output**: `{ media: AdminMediaSchema[], total: number, page: number, perPage: number }`
- **AdminMediaSchema fields**: `id, type (IMAGE|VIDEO), caption, image (Json | null, Cloudinary image object for thumbnail), spot: { id, name } | null, addedBy: { username }, createdAt`
- **Auth**: `authed` + `admin` middleware

### Reused endpoint: `admin.users.list`

Already exists. Called with `{ page: 1, perPage: 5, sortBy: 'createdAt', sortOrder: 'desc' }` for the latest users section.

## Files changed (API)

- `packages/contracts/src/schemas/admin.ts` -- Add `AdminOverviewSchema`, `AdminSpotSchema`, `AdminMediaSchema`, `listSpotsInput`, `listSpotsOutput`, `listMediaInput`, `listMediaOutput` Zod schemas
- `packages/contracts/src/contract.ts` -- Add `admin.overview`, `admin.spots.list`, `admin.media.list` contract entries
- `apps/api/src/orpc/routers/admin.ts` -- Implement handlers for the three new endpoints

## Frontend Layer

### Routing

- Delete `src/app/page.tsx` (currently `redirect('/users')`) to avoid route conflict
- Create `src/app/(dashboard)/page.tsx` -- The dashboard page, served at `/` within the `(dashboard)` route group which provides the sidebar layout and auth guard

### Sidebar navigation

Update `src/components/app-sidebar.tsx`:
- Add "Home" as the first nav item (url: `/`, icon: `LayoutDashboard` from lucide-react)
- Keep "Users" under the existing "Management" group

### Dashboard page layout

Top to bottom:

1. **Stats row** -- 4 `Card` components in a responsive CSS grid (`grid-cols-2 lg:grid-cols-4`)
   - Total Users (Users icon)
   - Total Spots (MapPin icon)
   - Total Media (Image icon)
   - Total Clips (Film icon)
   - Each card: `Card > CardHeader (icon + title) > CardContent (count number, large text)`

2. **Latest sections** -- 3-column responsive grid (`grid-cols-1 lg:grid-cols-3`), each column is a `Card`:
   - **Latest Users** (5 items): avatar, username, email, relative join date. Each row links to `/users/[username]`.
   - **Latest Spots** (5 items): name, city/country, type badge, relative added date.
   - **Latest Media** (5 items): type badge (IMAGE/VIDEO), caption (truncated), spot name if present, relative added date.

### Data fetching

Four parallel `useQuery` calls via oRPC TanStack Query utils:

```
orpc.admin.overview.queryOptions()
orpc.admin.users.list.queryOptions({ input: { page: 1, perPage: 5, sortBy: 'createdAt', sortOrder: 'desc' } })
orpc.admin.spots.list.queryOptions({ input: { page: 1, perPage: 5, sortBy: 'createdAt', sortOrder: 'desc' } })
orpc.admin.media.list.queryOptions({ input: { page: 1, perPage: 5, sortBy: 'createdAt', sortOrder: 'desc' } })
```

### Loading states

- Stats row: 4 `Skeleton` cards matching the card dimensions
- Latest sections: 3 `Skeleton` card frames with 5 skeleton rows each
- Uses existing `@krak/ui` `Skeleton` component

### Components

All UI uses existing `@krak/ui` components (`Card`, `CardHeader`, `CardTitle`, `CardContent`, `Badge`, `Avatar`, `Skeleton`). No new shared components needed. The dashboard page is self-contained.

## Files changed (Frontend)

- `src/app/page.tsx` -- Delete this file. The `(dashboard)/page.tsx` route group handles `/` with the sidebar layout.
- `src/app/(dashboard)/page.tsx` -- New dashboard page
- `src/components/app-sidebar.tsx` -- Add "Home" nav item

## Error handling

- Each query has independent error states. If one fails, the others still render.
- Failed sections show an inline error message within their card.
- No retry UI needed; TanStack Query's default retry (3 attempts) handles transient failures.

## Testing

No test infrastructure exists in `apps/manager`. Manual verification: start the dev servers (`bun run dev:api` + manager dev), log in as admin, confirm stats match DB counts and latest items are chronologically correct.
