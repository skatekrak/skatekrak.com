# User Info Edit Mode — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add inline edit mode for core user fields (username, displayUsername, email, name, role) on the manager app's user detail page, with a role-change confirmation dialog.

**Architecture:** Full-stack feature across three layers: Zod schemas in `packages/contracts`, an oRPC handler in `apps/api`, and a react-hook-form edit mode in `apps/manager`. Follows the existing spot/map inline-edit pattern exactly.

**Tech Stack:** Zod, oRPC, Prisma, react-hook-form, @hookform/resolvers/zod, @radix-ui/react-alert-dialog, @krak/ui, TanStack Query.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `packages/contracts/src/schemas/admin.ts` | Modify | Add `updateUserInput` and `updateUserOutput` Zod schemas |
| `packages/contracts/src/contract.ts` | Modify | Add `admin.users.update` contract entry |
| `apps/api/src/orpc/routers/admin.ts` | Modify | Add `updateUser` handler |
| `apps/api/src/orpc/router.ts` | Modify | Wire `updateUser` into the router |
| `packages/ui/src/components/ui/alert-dialog.tsx` | Create | AlertDialog component (shadcn) |
| `packages/ui/src/index.ts` | Modify | Export AlertDialog components |
| `packages/ui/package.json` | Modify | Add `@radix-ui/react-alert-dialog` dependency |
| `apps/manager/src/app/(dashboard)/users/[username]/page.tsx` | Modify | Add edit mode to UserInfoCard, role confirmation dialog |

---

### Task 1: Add update user schemas to contracts

**Files:**
- Modify: `packages/contracts/src/schemas/admin.ts` (after line 133, before the overview stats section)
- Modify: `packages/contracts/src/contract.ts` (lines 6, 99)

- [ ] **Step 1: Add `updateUserInput` and `updateUserOutput` schemas**

In `packages/contracts/src/schemas/admin.ts`, add after the `getUserByUsernameOutput` block (after line 133), before the `// Overview stats` section:

```ts
// ============================================================================
// Update user
// ============================================================================

export const updateUserInput = z.object({
    id: z.string(),
    username: z.string().min(1).optional(),
    displayUsername: z.string().nullable().optional(),
    email: z.string().email().nullable().optional(),
    name: z.string().nullable().optional(),
    role: RoleSchema.optional(),
});

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

- [ ] **Step 2: Add `admin.users.update` to the contract**

In `packages/contracts/src/contract.ts`:

Add `updateUserInput` and `updateUserOutput` to the imports from `./schemas/admin` (line 6):

```ts
import {
    listUsersInput,
    listUsersOutput,
    getUserByUsernameInput,
    getUserByUsernameOutput,
    updateUserInput,
    updateUserOutput,
    adminOverviewOutput,
    // ... rest unchanged
} from './schemas/admin';
```

Add the `update` entry to `admin.users` (after line 99):

```ts
admin: {
    // ...
    users: {
        list: oc.input(listUsersInput).output(listUsersOutput),
        getByUsername: oc.input(getUserByUsernameInput).output(getUserByUsernameOutput),
        update: oc.input(updateUserInput).output(updateUserOutput),
    },
    // ...
},
```

- [ ] **Step 3: Verify contracts build**

Run: `bun run build --filter=@krak/contracts`

Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add packages/contracts/src/schemas/admin.ts packages/contracts/src/contract.ts
git commit -m "feat(contracts): add admin.users.update contract"
```

---

### Task 2: Add update user API handler

**Files:**
- Modify: `apps/api/src/orpc/routers/admin.ts` (add after the `getUserByUsername` handler, around line 160)
- Modify: `apps/api/src/orpc/router.ts` (lines 4, 69)

- [ ] **Step 1: Add `updateUser` handler**

In `apps/api/src/orpc/routers/admin.ts`, add after the `getUserByUsername` handler (after its closing `});`), before the `// admin.spots.list` section:

```ts
// ============================================================================
// admin.users.update — Update core user fields (admin only)
// ============================================================================

export const updateUser = os.admin.users.update
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { id, ...fields } = input;

        // Verify user exists
        const existing = await context.prisma.user.findUnique({ where: { id } });
        if (!existing) {
            throw new ORPCError('NOT_FOUND', { message: `User '${id}' not found` });
        }

        // Uniqueness checks for fields that must be unique
        if (fields.username !== undefined && fields.username !== existing.username) {
            const taken = await context.prisma.user.findUnique({ where: { username: fields.username } });
            if (taken) {
                throw new ORPCError('CONFLICT', { message: 'Username already taken' });
            }
        }

        if (fields.displayUsername !== undefined && fields.displayUsername !== null && fields.displayUsername !== existing.displayUsername) {
            const taken = await context.prisma.user.findUnique({ where: { displayUsername: fields.displayUsername } });
            if (taken) {
                throw new ORPCError('CONFLICT', { message: 'Display username already taken' });
            }
        }

        if (fields.email !== undefined && fields.email !== null && fields.email !== existing.email) {
            const taken = await context.prisma.user.findUnique({ where: { email: fields.email } });
            if (taken) {
                throw new ORPCError('CONFLICT', { message: 'Email already taken' });
            }
        }

        // Build conditional update data
        const data: Prisma.UserUpdateInput = {};
        if (fields.username !== undefined) data.username = fields.username;
        if (fields.displayUsername !== undefined) data.displayUsername = fields.displayUsername;
        if (fields.email !== undefined) data.email = fields.email;
        if (fields.name !== undefined) data.name = fields.name;
        if (fields.role !== undefined) data.role = fields.role;

        const user = await context.prisma.user.update({
            where: { id },
            data,
        });

        return {
            id: user.id,
            username: user.username,
            displayUsername: user.displayUsername,
            email: user.email,
            name: user.name,
            role: user.role,
            updatedAt: user.updatedAt,
        };
    });
```

- [ ] **Step 2: Wire `updateUser` into the router**

In `apps/api/src/orpc/router.ts`:

Add `updateUser` to the import from `./routers/admin` (line 4):

```ts
import {
    listUsers,
    getUserByUsername,
    updateUser,
    overview,
    listSpots,
    // ... rest unchanged
} from './routers/admin';
```

Add `update: updateUser` to the `admin.users` section (after line 69):

```ts
admin: {
    overview,
    users: {
        list: listUsers,
        getByUsername: getUserByUsername,
        update: updateUser,
    },
    // ... rest unchanged
},
```

- [ ] **Step 3: Verify API builds**

Run: `bun run build --filter=@krak/api`

Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/orpc/routers/admin.ts apps/api/src/orpc/router.ts
git commit -m "feat(api): add admin.users.update handler"
```

---

### Task 3: Add AlertDialog component to @krak/ui

**Files:**
- Create: `packages/ui/src/components/ui/alert-dialog.tsx`
- Modify: `packages/ui/src/index.ts`
- Modify: `packages/ui/package.json`

- [ ] **Step 1: Install @radix-ui/react-alert-dialog**

Run from the `packages/ui` directory:

```bash
bun add @radix-ui/react-alert-dialog
```

- [ ] **Step 2: Create the AlertDialog component**

Create `packages/ui/src/components/ui/alert-dialog.tsx` with the standard shadcn alert-dialog implementation:

```tsx
'use client';

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import * as React from 'react';

import { buttonVariants } from './button';
import { cn } from '../../lib/utils';

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Overlay
        className={cn(
            'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            className,
        )}
        {...props}
        ref={ref}
    />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
    <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogPrimitive.Content
            ref={ref}
            className={cn(
                'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
                className,
            )}
            {...props}
        />
    </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

const AlertDialogTitle = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Title ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Action>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Cancel>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Cancel
        ref={ref}
        className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)}
        {...props}
    />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
    AlertDialog,
    AlertDialogPortal,
    AlertDialogOverlay,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
};
```

- [ ] **Step 3: Export from `@krak/ui`**

In `packages/ui/src/index.ts`, add after the `Sheet` exports (at the end of the file):

```ts
export {
    AlertDialog,
    AlertDialogPortal,
    AlertDialogOverlay,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from './components/ui/alert-dialog';
```

- [ ] **Step 4: Build @krak/ui**

Run: `bun run build --filter=@krak/ui`

Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/components/ui/alert-dialog.tsx packages/ui/src/index.ts packages/ui/package.json
git commit -m "feat(ui): add AlertDialog component"
```

---

### Task 4: Add edit mode to UserInfoCard

**Files:**
- Modify: `apps/manager/src/app/(dashboard)/users/[username]/page.tsx`

This is the main frontend task. The `UserInfoCard` component gets a read/edit toggle, a react-hook-form form, and a role-change confirmation dialog.

- [ ] **Step 1: Add imports**

In `apps/manager/src/app/(dashboard)/users/[username]/page.tsx`, replace the existing imports (lines 1-25) with:

```tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SiInstagram } from '@icons-pack/react-simple-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Globe, Ghost, ExternalLink, Pencil } from 'lucide-react';
import { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import type { ContractOutputs } from '@krak/contracts';
import { RoleSchema } from '@krak/contracts';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Badge,
    Button,
    Avatar,
    AvatarFallback,
    AvatarImage,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Separator,
    Skeleton,
} from '@krak/ui';

import { SiteHeader } from '@/components/site-header';
import { client, orpc } from '@/lib/orpc';
```

- [ ] **Step 2: Add the edit form schema**

After the `type UserDetailOutput` line (line 26 area), add:

```tsx
type UserDetailOutput = ContractOutputs['admin']['users']['getByUsername'];

// ============================================================================
// Edit form schema
// ============================================================================

const editUserInfoSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    displayUsername: z.string(),
    email: z.string().email('Invalid email').or(z.literal('')),
    name: z.string(),
    role: RoleSchema,
});

type EditUserInfoValues = z.infer<typeof editUserInfoSchema>;
```

- [ ] **Step 3: Replace the `UserInfoCard` component**

Replace the existing `UserInfoCard` function (lines 113-174) with the following. This contains both read and edit modes, the mutation, and the role-change confirmation dialog:

```tsx
function UserInfoCard({ user, username }: { user: UserDetailOutput['user']; username: string }) {
    const [isEditing, setIsEditing] = useState(false);
    const [showRoleConfirm, setShowRoleConfirm] = useState(false);
    const [pendingValues, setPendingValues] = useState<EditUserInfoValues | null>(null);
    const queryClient = useQueryClient();
    const router = useRouter();

    const form = useForm<EditUserInfoValues>({
        resolver: zodResolver(editUserInfoSchema),
        defaultValues: {
            username: user.username,
            displayUsername: user.displayUsername ?? '',
            email: user.email ?? '',
            name: user.name ?? '',
            role: user.role,
        },
    });

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
        onSuccess: (data) => {
            if (data.username !== username) {
                router.replace(`/users/${data.username}`);
            } else {
                queryClient.invalidateQueries({
                    queryKey: orpc.admin.users.getByUsername.queryOptions({ input: { username } }).queryKey,
                });
            }
            setIsEditing(false);
        },
    });

    const handleEdit = () => {
        form.reset({
            username: user.username,
            displayUsername: user.displayUsername ?? '',
            email: user.email ?? '',
            name: user.name ?? '',
            role: user.role,
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        form.reset();
        mutation.reset();
        setIsEditing(false);
    };

    const handleSubmit = (values: EditUserInfoValues) => {
        if (values.role !== user.role) {
            setPendingValues(values);
            setShowRoleConfirm(true);
        } else {
            mutation.mutate(values);
        }
    };

    const handleConfirmRoleChange = () => {
        if (pendingValues) {
            mutation.mutate(pendingValues);
        }
        setShowRoleConfirm(false);
        setPendingValues(null);
    };

    const handleCancelRoleChange = () => {
        setShowRoleConfirm(false);
        setPendingValues(null);
    };

    if (isEditing) {
        return (
            <>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>User Info</CardTitle>
                        <Button variant="ghost" size="sm" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(handleSubmit)}
                                className="flex flex-col gap-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="displayUsername"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Display Username</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" {...field} />
                                                </FormControl>
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
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {['USER', 'MODERATOR', 'ADMIN'].map((r) => (
                                                        <SelectItem key={r} value={r}>
                                                            {r.toLowerCase()}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {mutation.error && (
                                    <p className="text-sm text-destructive">
                                        {mutation.error.message || 'Failed to update user.'}
                                    </p>
                                )}

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={mutation.isPending}>
                                        {mutation.isPending ? 'Saving...' : 'Save'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <AlertDialog open={showRoleConfirm} onOpenChange={setShowRoleConfirm}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm role change</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to change this user&apos;s role from{' '}
                                <strong>{user.role.toLowerCase()}</strong> to{' '}
                                <strong>{pendingValues?.role.toLowerCase()}</strong>?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={handleCancelRoleChange}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmRoleChange}>Confirm</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>User Info</CardTitle>
                <Button variant="ghost" size="icon" onClick={handleEdit}>
                    <Pencil className="size-4" />
                </Button>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Email">
                        <span className="flex items-center gap-2">
                            {user.email ?? '-'}
                            {user.email && (
                                <Badge variant={user.emailVerified ? 'default' : 'outline'} className="text-xs">
                                    {user.emailVerified ? 'verified' : 'unverified'}
                                </Badge>
                            )}
                        </span>
                    </Field>
                    <Field label="Name">{user.name ?? '-'}</Field>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Role">
                        <RoleBadge role={user.role} />
                    </Field>
                    <Field label="Status">
                        <BanStatus banned={user.banned} reason={user.banReason} expires={user.banExpires} />
                    </Field>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Subscription">
                        <SubscriptionBadge status={user.subscriptionStatus} />
                    </Field>
                    <Field label="Stripe Customer ID">
                        {user.stripeCustomerId ? <code className="text-xs">{user.stripeCustomerId}</code> : '-'}
                    </Field>
                </div>
                {user.subscriptionEndAt && <DateField label="Subscription End" value={user.subscriptionEndAt} />}

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Newsletter">
                        <Badge variant="outline">{user.receiveNewsletter ? 'subscribed' : 'not subscribed'}</Badge>
                    </Field>
                    <Field label="Welcome Mail">
                        <Badge variant="outline">{user.welcomeMailSent ? 'sent' : 'not sent'}</Badge>
                    </Field>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                    <DateField label="Created" value={user.createdAt} />
                    <DateField label="Updated" value={user.updatedAt} />
                </div>
            </CardContent>
        </Card>
    );
}
```

- [ ] **Step 4: Update `UserInfoCard` usage in the page component**

In the page component's render (around line 440), the `UserInfoCard` now needs the `username` prop from params. Change:

```tsx
<UserInfoCard user={data.user} />
```

to:

```tsx
<UserInfoCard user={data.user} username={username} />
```

- [ ] **Step 5: Verify manager builds**

Run: `bun run build --filter=@krak/manager`

Expected: Build succeeds with no errors.

- [ ] **Step 6: Commit**

```bash
git add apps/manager/src/app/(dashboard)/users/[username]/page.tsx
git commit -m "feat(manager): add edit mode to UserInfoCard with role confirmation"
```

---

### Task 5: Full build verification

- [ ] **Step 1: Run full monorepo build**

Run: `bun run build`

Expected: All packages and apps build successfully.

- [ ] **Step 2: Run lint**

Run: `bun run lint`

Expected: No lint errors.

- [ ] **Step 3: Run format check**

Run: `bun run format:check`

If formatting issues are found, run `bun run format` and amend the last commit.
