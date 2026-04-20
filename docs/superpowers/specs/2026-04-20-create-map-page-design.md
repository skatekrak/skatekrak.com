# Create Map Page — Design Spec

## Overview

Add a full-stack "Create Map" feature to the manager app: an API endpoint to create maps and a frontend page with a form + live preview, matching the existing map detail page layout.

## Backend

### Contract Schema (`packages/contracts/src/schemas/admin.ts`)

New `createMapInput` Zod schema:

| Field        | Type                          | Required | Default |
|-------------|-------------------------------|----------|---------|
| `id`        | `z.string().regex(/^[a-z0-9-]+$/)` | Yes      | —       |
| `name`      | `z.string().min(1)`           | Yes      | —       |
| `subtitle`  | `z.string()`                  | No       | `""`    |
| `categories`| `z.array(AdminMapCategorySchema).min(1)` | Yes | —   |
| `edito`     | `z.string()`                  | No       | `""`    |
| `about`     | `z.string()`                  | No       | `""`    |
| `staging`   | `z.boolean()`                 | No       | `false` |
| `videos`    | `z.array(z.string())`         | No       | `[]`    |
| `soundtrack`| `z.array(z.string())`         | No       | `[]`    |

Output reuses the existing `MapSchema`.

### Contract Registration (`packages/contracts/src/contract.ts`)

Add under `admin.maps`:

```ts
create: oc.input(createMapInput).output(MapSchema),
```

### API Handler (`apps/api/src/orpc/routers/admin.ts`)

- Uses `authed` + `admin` middleware (same as all admin endpoints).
- Calls `prisma.map.create(...)` with the input data.
- Returns 409 Conflict if a map with the given `id` already exists.
- Returns the created map object.

## Frontend

### Route

`apps/manager/src/app/(dashboard)/maps/new/page.tsx`

### Entry Point

Add a "Create Map" button (with `Plus` icon) on the maps list page (`maps/page.tsx`) that links to `/maps/new`.

### Page Layout

```
<SiteHeader title="Create Map" />
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 pb-6 pt-4">
  <div>               <!-- Left: Form Card (1 col) -->
  <div class="lg:col-span-2">  <!-- Right: Live Preview (2 cols) -->
</div>
```

Mirrors the existing map detail page grid (`lg:grid-cols-3` with 1:2 ratio).

### Form (Left Column)

Single Card component using react-hook-form + zodResolver with a Zod schema matching `createMapInput`.

**Fields (top to bottom):**

| Field        | Component                    | Notes                                       |
|-------------|------------------------------|---------------------------------------------|
| `id`        | `Input`                      | Slug field. Hint: "URL-safe identifier". Validated `/^[a-z0-9-]+$/`. |
| `name`      | `Input`                      | Required.                                   |
| `subtitle`  | `Input`                      | Optional.                                   |
| `categories`| Checkbox group               | Uses `AdminMapCategorySchema` enum values. At least one required. |
| `edito`     | `Textarea`                   | Optional, multi-line.                       |
| `about`     | `Textarea`                   | Optional, multi-line.                       |
| `staging`   | `Switch`                     | Boolean toggle, defaults off.               |
| `videos`    | Dynamic Input list           | Add/remove buttons per entry. Each is a URL string. |
| `soundtrack`| Dynamic Input list           | Add/remove buttons per entry. Each is a track name. |

**Bottom of form:** "Create Map" submit button + "Cancel" link back to `/maps`.

**Form library:** react-hook-form with `@hookform/resolvers` zodResolver, using `Form`/`FormField`/`FormItem`/`FormLabel`/`FormControl`/`FormMessage` from `@krak/ui`. Follows the exact same pattern as the spot info edit form in `spots/[id]/info/page.tsx`.

### Live Preview (Right Column)

A read-only preview card (`lg:col-span-2`) that mirrors `MapInfoCard` styling from the detail page.

Uses `form.watch()` to subscribe to all form values and re-render live as the user types.

**Content (top to bottom):**

- **Name** — large heading. Shows "Map Name" placeholder when empty.
- **Subtitle** — smaller text below name. Hidden when empty.
- **Staging badge** — shown when staging toggle is on.
- **Categories** — rendered as badges (same style as detail page).
- **Edito** — text block. Hidden when empty.
- **About** — text block. Hidden when empty.
- **Videos** — list of URLs. Hidden when empty.
- **Soundtrack** — list of track names. Hidden when empty.
- **ID** — muted text at bottom showing the slug.

**Empty state:** When form is blank, show the name placeholder and a muted message: "Fill in the form to see a preview."

No interactivity in the preview — purely visual feedback.

### Submission Flow

1. `useMutation` calls `client.admin.maps.create(values)`.
2. On success: invalidates `orpc.admin.maps.list` query cache, redirects to `/maps/[newId]`.
3. On 409 error (slug conflict): sets an error on the `id` field via `form.setError('id', ...)`.
4. On other errors: displays inline error message.

## Files to Create/Modify

### New files:
- `apps/manager/src/app/(dashboard)/maps/new/page.tsx` — create map page (form + preview)

### Modified files:
- `packages/contracts/src/schemas/admin.ts` — add `createMapInput` schema
- `packages/contracts/src/contract.ts` — add `admin.maps.create` contract
- `apps/api/src/orpc/routers/admin.ts` — add create map handler
- `apps/manager/src/app/(dashboard)/maps/page.tsx` — add "Create Map" button
