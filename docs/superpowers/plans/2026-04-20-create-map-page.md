# Create Map Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-stack "Create Map" feature — API endpoint + manager frontend page with form and live preview.

**Architecture:** New `createMapInput` contract schema, `admin.maps.create` oRPC handler using Prisma, and a `/maps/new` page in the manager app with react-hook-form + live preview card. Layout mirrors the existing map detail page (1:2 grid).

**Tech Stack:** Zod, oRPC, Prisma, React 19, Next.js App Router, react-hook-form, @krak/ui (shadcn), Tailwind CSS v4, TanStack Query.

---

## File Structure

### New files:
- `apps/manager/src/app/(dashboard)/maps/new/page.tsx` — Create map page (form + live preview)

### Modified files:
- `packages/contracts/src/schemas/admin.ts` — Add `createMapInput` schema
- `packages/contracts/src/contract.ts` — Add `admin.maps.create` to contract
- `apps/api/src/orpc/routers/admin.ts` — Add `createAdminMap` handler
- `apps/api/src/orpc/router.ts` — Register `createAdminMap` in router
- `apps/manager/src/app/(dashboard)/maps/page.tsx` — Add "Create Map" button

---

### Task 1: Add `createMapInput` contract schema

**Files:**
- Modify: `packages/contracts/src/schemas/admin.ts:361` (append after `adminListMapsOutput`)

- [ ] **Step 1: Add the schema**

In `packages/contracts/src/schemas/admin.ts`, append after the `adminListMapsOutput` definition (after line 361):

```ts
export const createMapInput = z.object({
    id: z
        .string()
        .min(1)
        .regex(/^[a-z0-9-]+$/, 'ID must contain only lowercase letters, numbers, and hyphens'),
    name: z.string().min(1),
    subtitle: z.string().default(''),
    categories: z.array(AdminMapCategorySchema).min(1, 'At least one category is required'),
    edito: z.string().default(''),
    about: z.string().default(''),
    staging: z.boolean().default(false),
    videos: z.array(z.string()).default([]),
    soundtrack: z.array(z.string()).default([]),
});
```

No new export needed from `packages/contracts/src/index.ts` — it already uses `export * from './schemas/admin'`.

- [ ] **Step 2: Add `admin.maps.create` to the contract**

In `packages/contracts/src/contract.ts`:

1. Add `createMapInput` to the import from `'./schemas/admin'` (line 18):

```ts
import {
    listUsersInput,
    listUsersOutput,
    getUserByUsernameInput,
    getUserByUsernameOutput,
    adminOverviewOutput,
    adminListSpotsInput,
    adminListSpotsOutput,
    updateSpotGeneralInfoInput,
    updateSpotGeneralInfoOutput,
    adminListMediaInput,
    adminListMediaOutput,
    adminListClipsInput,
    adminListClipsOutput,
    adminListMapsInput,
    adminListMapsOutput,
    createMapInput,
} from './schemas/admin';
```

2. Add `create` under `admin.maps` (line 106-108), changing:

```ts
        maps: {
            list: oc.input(adminListMapsInput).output(adminListMapsOutput),
        },
```

to:

```ts
        maps: {
            list: oc.input(adminListMapsInput).output(adminListMapsOutput),
            create: oc.input(createMapInput).output(MapSchema),
        },
```

- [ ] **Step 3: Verify contracts build**

Run: `bun run build --filter=@krak/contracts`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add packages/contracts/
git commit -m "feat(contracts): add createMapInput schema and admin.maps.create contract"
```

---

### Task 2: Add API handler for `admin.maps.create`

**Files:**
- Modify: `apps/api/src/orpc/routers/admin.ts:465` (append after `listAdminMaps`)
- Modify: `apps/api/src/orpc/router.ts:10,78`

- [ ] **Step 1: Add the handler**

In `apps/api/src/orpc/routers/admin.ts`, append after the `listAdminMaps` handler (after line 465):

```ts
// ============================================================================
// admin.maps.create — Create a new map
// ============================================================================

export const createAdminMap = os.admin.maps.create
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { id, name, subtitle, categories, edito, about, staging, videos, soundtrack } = input;

        const existing = await context.prisma.map.findUnique({ where: { id } });
        if (existing) {
            throw new ORPCError('CONFLICT', { message: `A map with ID "${id}" already exists` });
        }

        const map = await context.prisma.map.create({
            data: {
                id,
                name,
                subtitle,
                categories,
                edito,
                about,
                staging,
                videos,
                soundtrack,
            },
        });

        return map;
    });
```

Also check how `ORPCError` is imported at the top of the file. Look for the existing import — it should be from `@orpc/server`. If not already imported, add:

```ts
import { ORPCError } from '@orpc/server';
```

- [ ] **Step 2: Register in the router**

In `apps/api/src/orpc/router.ts`:

1. Add `createAdminMap` to the import from `'./routers/admin'` (line 1-11):

```ts
import {
    listUsers,
    getUserByUsername,
    overview,
    listSpots,
    updateSpotGeneralInfo,
    listMedia,
    listClips,
    listAdminMaps,
    createAdminMap,
} from './routers/admin';
```

2. Add `create: createAdminMap` under `admin.maps` (line 77-79), changing:

```ts
        maps: {
            list: listAdminMaps,
        },
```

to:

```ts
        maps: {
            list: listAdminMaps,
            create: createAdminMap,
        },
```

- [ ] **Step 3: Verify API builds**

Run: `bun run build --filter=@krak/api`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add apps/api/
git commit -m "feat(api): add admin.maps.create handler"
```

---

### Task 3: Add "Create Map" button to maps list page

**Files:**
- Modify: `apps/manager/src/app/(dashboard)/maps/page.tsx`

- [ ] **Step 1: Add the button**

In `apps/manager/src/app/(dashboard)/maps/page.tsx`:

1. Add `Plus` to the lucide-react import (line 5):

```ts
import { ChevronDown, Plus } from 'lucide-react';
```

2. Add `Link` import from Next.js:

```ts
import Link from 'next/link';
```

3. Inside the toolbar `<div className="flex items-center gap-3">` (line 119), add the button after the DropdownMenu (after line 145, before the closing `</div>` on line 146):

```tsx
                    <div className="ml-auto">
                        <Button asChild>
                            <Link href="/maps/new">
                                <Plus className="mr-2 size-4" />
                                Create Map
                            </Link>
                        </Button>
                    </div>
```

- [ ] **Step 2: Commit**

```bash
git add apps/manager/src/app/\(dashboard\)/maps/page.tsx
git commit -m "feat(manager): add Create Map button to maps list page"
```

---

### Task 4: Create the `/maps/new` page with form and live preview

**Files:**
- Create: `apps/manager/src/app/(dashboard)/maps/new/page.tsx`

- [ ] **Step 1: Create the page file**

Create `apps/manager/src/app/(dashboard)/maps/new/page.tsx` with the full content:

```tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Music, Plus, Trash2, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { AdminMapCategorySchema } from '@krak/contracts';
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Separator,
    Switch,
    Textarea,
} from '@krak/ui';

import { SiteHeader } from '@/components/site-header';
import { client, orpc } from '@/lib/orpc';

// ============================================================================
// Constants
// ============================================================================

const mapCategories = AdminMapCategorySchema.options;

const categoryLabels: Record<string, string> = {
    maps: 'Maps',
    video: 'Video',
    skater: 'Skaters',
    filmer: 'Filmers',
    photographer: 'Photographers',
    magazine: 'Magazines',
    skatepark: 'Skateparks',
    shop: 'Shops',
    years: 'Years',
    greatest: 'Greatest',
    members: 'Members',
    artist: 'Artists',
};

// ============================================================================
// Form schema
// ============================================================================

const createMapSchema = z.object({
    id: z
        .string()
        .min(1, 'ID is required')
        .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
    name: z.string().min(1, 'Name is required'),
    subtitle: z.string(),
    categories: z.array(z.string()).min(1, 'At least one category is required'),
    edito: z.string(),
    about: z.string(),
    staging: z.boolean(),
    videos: z.array(z.object({ value: z.string() })),
    soundtrack: z.array(z.object({ value: z.string() })),
});

type CreateMapValues = z.infer<typeof createMapSchema>;

// ============================================================================
// Live Preview Component
// ============================================================================

function MapPreview({ values }: { values: CreateMapValues }) {
    const hasContent = values.name || values.subtitle || values.categories.length > 0;

    return (
        <Card className="sticky top-6">
            <CardHeader>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <CardTitle>{values.name || 'Map Name'}</CardTitle>
                        {values.staging && (
                            <Badge variant="outline" className="text-xs">
                                Staging
                            </Badge>
                        )}
                    </div>
                    {values.subtitle && <p className="text-sm text-muted-foreground">{values.subtitle}</p>}
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {!hasContent && <p className="text-sm text-muted-foreground">Fill in the form to see a preview.</p>}

                {/* Categories */}
                {values.categories.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium">Categories</span>
                        <div className="flex flex-wrap gap-1">
                            {values.categories.map((cat) => (
                                <Badge key={cat} variant="secondary">
                                    {categoryLabels[cat] ?? cat}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {values.categories.length > 0 && (values.edito || values.about) && <Separator />}

                {/* Edito */}
                {values.edito && (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Edito</span>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{values.edito}</p>
                    </div>
                )}

                {/* About */}
                {values.about && (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">About</span>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{values.about}</p>
                    </div>
                )}

                {/* Videos */}
                {values.videos.filter((v) => v.value).length > 0 && (
                    <>
                        <Separator />
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium">Videos</span>
                            {values.videos
                                .filter((v) => v.value)
                                .map((v, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Video className="size-4 shrink-0" />
                                        <span className="truncate">{v.value}</span>
                                    </div>
                                ))}
                        </div>
                    </>
                )}

                {/* Soundtrack */}
                {values.soundtrack.filter((s) => s.value).length > 0 && (
                    <>
                        <Separator />
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium">Soundtrack</span>
                            {values.soundtrack
                                .filter((s) => s.value)
                                .map((s, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Music className="size-4 shrink-0" />
                                        <span className="truncate">{s.value}</span>
                                    </div>
                                ))}
                        </div>
                    </>
                )}

                {(values.edito || values.about || values.videos.some((v) => v.value) || values.soundtrack.some((s) => s.value)) && <Separator />}

                {/* ID */}
                {values.id && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">ID</span>
                        <span className="font-mono text-sm text-muted-foreground">{values.id}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// ============================================================================
// Page Component
// ============================================================================

export default function CreateMapPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const form = useForm<CreateMapValues>({
        resolver: zodResolver(createMapSchema),
        defaultValues: {
            id: '',
            name: '',
            subtitle: '',
            categories: [],
            edito: '',
            about: '',
            staging: false,
            videos: [],
            soundtrack: [],
        },
    });

    const videosField = useFieldArray({ control: form.control, name: 'videos' });
    const soundtrackField = useFieldArray({ control: form.control, name: 'soundtrack' });

    const watchedValues = form.watch();

    const mutation = useMutation({
        mutationFn: (values: CreateMapValues) => {
            return client.admin.maps.create({
                id: values.id,
                name: values.name,
                subtitle: values.subtitle,
                categories: values.categories,
                edito: values.edito,
                about: values.about,
                staging: values.staging,
                videos: values.videos.map((v) => v.value).filter(Boolean),
                soundtrack: values.soundtrack.map((s) => s.value).filter(Boolean),
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: orpc.admin.maps.list.queryOptions({ input: {} }).queryKey,
            });
            router.push(`/maps/${data.id}`);
        },
        onError: (error) => {
            if (error.message?.includes('already exists')) {
                form.setError('id', { message: 'A map with this ID already exists' });
            }
        },
    });

    function toggleCategory(cat: string) {
        const current = form.getValues('categories');
        if (current.includes(cat)) {
            form.setValue(
                'categories',
                current.filter((c) => c !== cat),
                { shouldValidate: true },
            );
        } else {
            form.setValue('categories', [...current, cat], { shouldValidate: true });
        }
    }

    return (
        <>
            <SiteHeader title="Create Map" />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Form */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>New Map</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
                                        className="flex flex-col gap-4"
                                    >
                                        <FormField
                                            control={form.control}
                                            name="id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>ID (slug)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="my-map" {...field} />
                                                    </FormControl>
                                                    <p className="text-xs text-muted-foreground">
                                                        URL-safe identifier (lowercase, numbers, hyphens)
                                                    </p>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Map name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="subtitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Subtitle</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Optional subtitle" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Categories as toggleable badges */}
                                        <FormField
                                            control={form.control}
                                            name="categories"
                                            render={() => (
                                                <FormItem>
                                                    <FormLabel>Categories</FormLabel>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {mapCategories.map((cat) => (
                                                            <Badge
                                                                key={cat}
                                                                variant={
                                                                    watchedValues.categories.includes(cat)
                                                                        ? 'default'
                                                                        : 'outline'
                                                                }
                                                                className="cursor-pointer"
                                                                onClick={() => toggleCategory(cat)}
                                                            >
                                                                {categoryLabels[cat] ?? cat}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="edito"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Edito</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Editorial content..."
                                                            rows={3}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="about"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>About</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="About this map..."
                                                            rows={3}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="staging"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center gap-3">
                                                    <FormLabel>Staging</FormLabel>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <Separator />

                                        {/* Videos dynamic list */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">Videos</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => videosField.append({ value: '' })}
                                                >
                                                    <Plus className="mr-1 size-4" />
                                                    Add
                                                </Button>
                                            </div>
                                            {videosField.fields.map((field, index) => (
                                                <div key={field.id} className="flex items-center gap-2">
                                                    <FormField
                                                        control={form.control}
                                                        name={`videos.${index}.value`}
                                                        render={({ field }) => (
                                                            <FormItem className="flex-1">
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="https://..."
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => videosField.remove(index)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Soundtrack dynamic list */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">Soundtrack</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => soundtrackField.append({ value: '' })}
                                                >
                                                    <Plus className="mr-1 size-4" />
                                                    Add
                                                </Button>
                                            </div>
                                            {soundtrackField.fields.map((field, index) => (
                                                <div key={field.id} className="flex items-center gap-2">
                                                    <FormField
                                                        control={form.control}
                                                        name={`soundtrack.${index}.value`}
                                                        render={({ field }) => (
                                                            <FormItem className="flex-1">
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Track name"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => soundtrackField.remove(index)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>

                                        <Separator />

                                        {mutation.error && !mutation.error.message?.includes('already exists') && (
                                            <p className="text-sm text-destructive">
                                                {mutation.error.message || 'Failed to create map.'}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-3">
                                            <Button type="submit" disabled={mutation.isPending}>
                                                {mutation.isPending ? 'Creating...' : 'Create Map'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => router.push('/maps')}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Live Preview */}
                    <div className="lg:col-span-2">
                        <MapPreview values={watchedValues} />
                    </div>
                </div>
            </div>
        </>
    );
}
```

- [ ] **Step 2: Verify the manager app builds**

Run: `bun run build --filter=@krak/manager`
Expected: Build succeeds. Fix any type errors.

- [ ] **Step 3: Commit**

```bash
git add apps/manager/src/app/\(dashboard\)/maps/new/
git commit -m "feat(manager): add create map page with form and live preview"
```

---

### Task 5: Final verification

- [ ] **Step 1: Full monorepo build**

Run: `bun run build`
Expected: All packages build successfully.

- [ ] **Step 2: Lint**

Run: `bun run lint`
Expected: No new lint errors.

- [ ] **Step 3: Manual smoke test (if dev server is available)**

1. Run `bun run dev:api` and `bun run dev:manager` (or equivalent)
2. Navigate to `/maps` — verify "Create Map" button is visible
3. Click "Create Map" — verify the form loads with the live preview on the right
4. Fill in the form — verify the preview updates live
5. Submit — verify redirect to the new map detail page
