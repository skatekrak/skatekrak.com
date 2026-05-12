# Media Hashtag Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a multi-hashtag AND filter to the admin media list so managers can filter media by hashtags extracted from captions.

**Architecture:** Add `hashtags` field to the admin list input contract, wire it through the API handler with Prisma's `hasEvery` filter, and add a free-text input with badge chips on both media pages using nuqs for URL state.

**Tech Stack:** Zod (contracts), Prisma `hasEvery` (API), nuqs + React (manager UI), `@krak/ui` Badge/Input components.

---

### Task 1: Add `hashtags` to the admin media list contract

**Files:**
- Modify: `packages/contracts/src/schemas/admin.ts:311-319`

- [ ] **Step 1: Add hashtags field to adminListMediaInput**

In `packages/contracts/src/schemas/admin.ts`, add `hashtags` to the `adminListMediaInput` schema. Insert after `spotId` (line 318):

```ts
export const adminListMediaInput = z.object({
    page: z.number().int().min(1).default(1),
    perPage: z.number().int().min(1).max(100).default(20),
    sortBy: z.enum(['createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    type: MediaTypeSchema.optional(),
    releaseStatus: MediaReleaseStatusSchema.optional(),
    spotId: z.string().optional(),
    hashtags: z.array(z.string()).optional(),
});
```

- [ ] **Step 2: Verify contracts package builds**

Run: `bun run build --filter=@krak/contracts`
Expected: Clean build, no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/contracts/src/schemas/admin.ts
git commit -m "feat(contracts): add hashtags filter to admin media list input"
```

---

### Task 2: Wire hashtag filter in the API handler

**Files:**
- Modify: `apps/api/src/orpc/routers/admin.ts:441-510`

- [ ] **Step 1: Add hashtag filter to the listMedia handler**

In `apps/api/src/orpc/routers/admin.ts`, update the `listMedia` handler.

First, add the `addHashtagIfNeeded` import at line 5 (update the existing import):

```ts
import { extractHashtags, addHashtagIfNeeded } from '../../helpers/hashtags';
```

Then destructure `hashtags` from input and add the filter. Replace line 445:

```ts
const { page, perPage, sortBy, sortOrder, type, releaseStatus, spotId, hashtags } = input;
```

Add the hashtag filter after the `releaseStatus` block (after line 462):

```ts
if (hashtags && hashtags.length > 0) {
    where.hashtags = { hasEvery: hashtags.map(addHashtagIfNeeded) };
}
```

- [ ] **Step 2: Verify API builds**

Run: `bun run build --filter=@krak/api`
Expected: Clean build, no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/orpc/routers/admin.ts
git commit -m "feat(api): add hashtags hasEvery filter to admin media list"
```

---

### Task 3: Add hashtag filter UI to the main media page

**Files:**
- Modify: `apps/manager/src/app/(dashboard)/media/page.tsx`

- [ ] **Step 1: Add nuqs state and imports**

In `apps/manager/src/app/(dashboard)/media/page.tsx`, update the nuqs import at line 5 to include `parseAsArrayOf`:

```ts
import { parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';
```

Add `X` to the lucide-react import at line 4:

```ts
import { Plus, X } from 'lucide-react';
```

Add `Badge` and `Input` to the `@krak/ui` import at line 8-19:

```ts
import {
    Badge,
    Button,
    DataTablePagination,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Tabs,
    TabsList,
    TabsTrigger,
} from '@krak/ui';
```

- [ ] **Step 2: Add hashtag state and handlers**

Inside `MediaPage()`, after the `showAddDialog` state (line 46), add:

```ts
const [hashtags, setHashtags] = useQueryState('hashtags', parseAsArrayOf(parseAsString).withDefault([]));
const [hashtagInput, setHashtagInput] = useState('');

function addHashtag(raw: string) {
    const tag = raw.trim().replace(/^#?/, '#').toLowerCase();
    if (tag.length <= 1) return;
    if (hashtags.includes(tag)) {
        setHashtagInput('');
        return;
    }
    setHashtags([...hashtags, tag]);
    setHashtagInput('');
    handlePageChange(1);
}

function removeHashtag(tag: string) {
    setHashtags(hashtags.filter((h) => h !== tag));
    handlePageChange(1);
}

function handleHashtagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addHashtag(hashtagInput);
    }
}
```

- [ ] **Step 3: Pass hashtags to the query**

Update the `useQuery` call to include hashtags. Replace the input object (lines 52-59):

```ts
const { data, isLoading } = useQuery(
    orpc.admin.media.list.queryOptions({
        input: {
            page,
            perPage,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            type: type ?? undefined,
            releaseStatus,
            hashtags: hashtags.length > 0 ? hashtags : undefined,
        },
    }),
);
```

- [ ] **Step 4: Add hashtag input and badges to the filter bar**

In the JSX, after the `</Select>` (line 104) and before the `{data &&` total count (line 105), add the hashtag filter UI:

```tsx
<div className="flex flex-wrap items-center gap-2">
    <Input
        placeholder="Filter by #hashtag"
        value={hashtagInput}
        onChange={(e) => setHashtagInput(e.target.value)}
        onKeyDown={handleHashtagKeyDown}
        className="w-48"
    />
    {hashtags.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1">
            {tag}
            <button type="button" onClick={() => removeHashtag(tag)} className="hover:text-destructive">
                <X className="size-3" />
            </button>
        </Badge>
    ))}
</div>
```

- [ ] **Step 5: Verify manager builds**

Run: `bun run build --filter=@krak/manager`
Expected: Clean build, no errors.

- [ ] **Step 6: Commit**

```bash
git add apps/manager/src/app/(dashboard)/media/page.tsx
git commit -m "feat(manager): add hashtag filter to main media page"
```

---

### Task 4: Add hashtag filter UI to the spot media page

**Files:**
- Modify: `apps/manager/src/app/(dashboard)/spots/[id]/media/page.tsx`

- [ ] **Step 1: Add nuqs state and imports**

In `apps/manager/src/app/(dashboard)/spots/[id]/media/page.tsx`, update the nuqs import at line 5 to include `parseAsArrayOf`:

```ts
import { parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';
```

Add `X` to the lucide-react import at line 4:

```ts
import { Plus, X } from 'lucide-react';
```

Add `Badge` and `Input` to the `@krak/ui` import at lines 8-19:

```ts
import {
    Badge,
    Button,
    DataTablePagination,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Tabs,
    TabsList,
    TabsTrigger,
} from '@krak/ui';
```

- [ ] **Step 2: Add hashtag state and handlers**

Inside `SpotMediaPage()`, after the `showAddDialog` state (line 49), add:

```ts
const [hashtags, setHashtags] = useQueryState('hashtags', parseAsArrayOf(parseAsString).withDefault([]));
const [hashtagInput, setHashtagInput] = useState('');

function addHashtag(raw: string) {
    const tag = raw.trim().replace(/^#?/, '#').toLowerCase();
    if (tag.length <= 1) return;
    if (hashtags.includes(tag)) {
        setHashtagInput('');
        return;
    }
    setHashtags([...hashtags, tag]);
    setHashtagInput('');
    handlePageChange(1);
}

function removeHashtag(tag: string) {
    setHashtags(hashtags.filter((h) => h !== tag));
    handlePageChange(1);
}

function handleHashtagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addHashtag(hashtagInput);
    }
}
```

- [ ] **Step 3: Pass hashtags to the query**

Update the `useQuery` call to include hashtags. Replace the input object (lines 52-62):

```ts
const { data, isLoading } = useQuery(
    orpc.admin.media.list.queryOptions({
        input: {
            page,
            perPage: PER_PAGE,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            type: type ?? undefined,
            releaseStatus,
            spotId,
            hashtags: hashtags.length > 0 ? hashtags : undefined,
        },
    }),
);
```

- [ ] **Step 4: Add hashtag input and badges to the filter bar**

In the JSX, after the `</Select>` (line 104) and before the `{data &&` total count (line 105), add the hashtag filter UI:

```tsx
<div className="flex flex-wrap items-center gap-2">
    <Input
        placeholder="Filter by #hashtag"
        value={hashtagInput}
        onChange={(e) => setHashtagInput(e.target.value)}
        onKeyDown={handleHashtagKeyDown}
        className="w-48"
    />
    {hashtags.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1">
            {tag}
            <button type="button" onClick={() => removeHashtag(tag)} className="hover:text-destructive">
                <X className="size-3" />
            </button>
        </Badge>
    ))}
</div>
```

- [ ] **Step 5: Verify full monorepo builds**

Run: `bun run build`
Expected: All packages and apps build cleanly.

- [ ] **Step 6: Commit**

```bash
git add apps/manager/src/app/(dashboard)/spots/[id]/media/page.tsx
git commit -m "feat(manager): add hashtag filter to spot media page"
```
