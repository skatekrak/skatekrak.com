# User Info Edit Mode — Manager App

## Summary

Add an inline edit mode to the `UserInfoCard` on the `/users/[username]` page in `apps/manager`. This covers the full stack: a new oRPC contract, an API handler, and a frontend form with a role-change confirmation dialog.

**Editable fields:** `username`, `displayUsername`, `email`, `name`, `role`.

**Everything else on the page stays read-only** (AccountsCard, ProfileCard, UserHero, ban status, subscription, flags).

## Architecture

Three layers, following the existing spot/map edit pattern:

```
packages/contracts  ->  apps/api  ->  apps/manager
(Zod schemas)          (handler)     (form + mutation)
```

---

## 1. Contract Layer (`packages/contracts`)

### New schemas in `schemas/admin.ts`

**`updateUserInput`**

```ts
export const updateUserInput = z.object({
    id: z.string(),
    username: z.string().min(1).optional(),
    displayUsername: z.string().nullable().optional(),
    email: z.string().email().nullable().optional(),
    name: z.string().nullable().optional(),
    role: RoleSchema.optional(),
});
```

All fields optional except `id`. This follows the same partial-update pattern as `updateSpotGeneralInfoInput` and `updateMapInput`.

**`updateUserOutput`**

```ts
export const updateUserOutput = z.object({
    id: z.string(),
    username: z.string(),
    displayUsername: z.string().nullable(),
    email: z.string().nullable(),
    name: z.string().nullable(),
    role: RoleSchema,
    updatedAt: z.coerce.date(),
});
```

### New contract entry in `contract.ts`

```ts
admin: {
    users: {
        list: ...,
        getByUsername: ...,
        update: oc.input(updateUserInput).output(updateUserOutput),  // NEW
    },
    ...
}
```

---

## 2. API Layer (`apps/api`)

### New handler in `routers/admin.ts`

`updateUser` — bound to `os.admin.users.update`, chained with `.use(authed).use(admin)`.

**Logic:**

1. Destructure `{ id, ...fields }` from input.
2. Fetch the existing user by `id`. Throw `ORPCError('NOT_FOUND')` if missing.
3. **Uniqueness checks** (only when the field is provided and differs from current value):
    - `username`: `findUnique({ where: { username } })` — throw `ORPCError('CONFLICT', { message: 'Username already taken' })` if taken by a different user.
    - `displayUsername`: same pattern.
    - `email`: same pattern.
4. Build a conditional `Prisma.UserUpdateInput` — only set fields that are `!== undefined`.
5. `prisma.user.update({ where: { id }, data })`.
6. Return the curated output: `{ id, username, displayUsername, email, name, role, updatedAt }`.

**Wire into the router** in `router.ts` alongside the existing `listUsers` and `getUserByUsername`.

---

## 3. Manager Frontend (`apps/manager`)

### Modifications to `users/[username]/page.tsx`

The existing `UserInfoCard` component gets split into read and edit modes using a `useState<boolean>` toggle, exactly like the `GeneralInfoCard` in the spots info page.

### Form schema

Local Zod schema defined above the component:

```ts
const editUserInfoSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    displayUsername: z.string(),
    email: z.string().email('Invalid email').or(z.literal('')),
    name: z.string(),
    role: RoleSchema,
});
```

### Edit mode behavior

1. **Edit button:** Ghost `<Pencil>` icon button in the `CardHeader`, triggers `handleEdit()` which resets the form to current user values and sets `isEditing(true)`.
2. **Form fields:**
    - `username` — `<Input>` (required)
    - `displayUsername` — `<Input>`
    - `email` — `<Input type="email">`
    - `name` — `<Input>`
    - `role` — `<Select>` with options: USER, MODERATOR, ADMIN
3. **Cancel button:** Ghost text button, resets form + mutation state, sets `isEditing(false)`.
4. **Save button:** Disabled while `mutation.isPending`, shows "Saving..." loading text.
5. **Error display:** `{mutation.error && <p className="text-sm text-destructive">...</p>}` below the form.

### Role change confirmation

When the user submits the form and the selected `role` differs from the current user's role:

1. Instead of immediately calling the mutation, open an `AlertDialog`.
2. Dialog content: "Are you sure you want to change this user's role from **{currentRole}** to **{newRole}**?"
3. Confirm executes the mutation. Cancel closes the dialog without saving.

If the role hasn't changed, the mutation fires directly without a dialog.

### Mutation

```ts
const mutation = useMutation({
    mutationFn: (values: EditUserInfoValues) =>
        client.admin.users.update({
            id: user.id,
            username: values.username,
            displayUsername: values.displayUsername || null,
            email: values.email || null,
            name: values.name || null,
            role: values.role,
        }),
    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: orpc.admin.users.getByUsername.queryOptions({
                input: { username },
            }).queryKey,
        });
        setIsEditing(false);
    },
});
```

**Username change handling:** The `onSuccess` callback checks if the returned `username` differs from the current page param. If so, it redirects via `router.replace(\`/users/${data.username}\`)` instead of just invalidating the query (since the old URL would 404). If the username is unchanged, it invalidates the query as normal.

### AlertDialog component

`@krak/ui` does not currently have an `AlertDialog` component. It needs to be added via shadcn:

```bash
cd packages/ui && bunx shadcn@latest add alert-dialog
```

Then export it from `packages/ui/src/index.ts`.

---

## Files Changed

| File                                                         | Change                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------- |
| `packages/contracts/src/schemas/admin.ts`                    | Add `updateUserInput`, `updateUserOutput`                     |
| `packages/contracts/src/contract.ts`                         | Add `admin.users.update` contract entry + imports             |
| `apps/api/src/orpc/routers/admin.ts`                         | Add `updateUser` handler                                      |
| `apps/api/src/orpc/router.ts`                                | Wire `updateUser` into the router                             |
| `packages/ui/`                                               | Add `AlertDialog` component via shadcn                        |
| `apps/manager/src/app/(dashboard)/users/[username]/page.tsx` | Add edit mode to `UserInfoCard`, add role confirmation dialog |

## Out of Scope

- Editing ban status, subscription, profile, or account fields
- Image/avatar upload
- Audit logging of changes
- Bulk user editing
