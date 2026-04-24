'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SiInstagram } from '@icons-pack/react-simple-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Globe, Ghost, ExternalLink, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { useForm } from 'react-hook-form';
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

// ============================================================================
// Helper components
// ============================================================================

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm">{label}</span>
            <span className="text-sm">{children}</span>
        </div>
    );
}

function DateField({ label, value }: { label: string; value: Date | null }) {
    if (!value) return <Field label={label}>-</Field>;
    return <Field label={label}>{format(value, 'PPpp')}</Field>;
}

function RoleBadge({ role }: { role: string }) {
    const variant = role === 'ADMIN' ? 'default' : role === 'MODERATOR' ? 'secondary' : 'outline';
    return <Badge variant={variant}>{role.toLowerCase()}</Badge>;
}

function BanStatus({ banned, reason, expires }: { banned: boolean; reason: string | null; expires: Date | null }) {
    if (!banned) {
        return <Badge variant="outline">active</Badge>;
    }
    return (
        <div className="flex flex-col gap-1">
            <Badge variant="destructive">banned</Badge>
            {reason && <span className="text-muted-foreground text-xs">{reason}</span>}
            {expires && (
                <span className="text-muted-foreground text-xs">Expires: {new Date(expires).toLocaleString()}</span>
            )}
        </div>
    );
}

function SubscriptionBadge({ status }: { status: string }) {
    const variant = status === 'ACTIVE' ? 'default' : status === 'NONE' ? 'outline' : 'secondary';
    return <Badge variant={variant}>{status.toLowerCase()}</Badge>;
}

function StatCell({ label, value }: { label: string; value: number | null | undefined }) {
    return (
        <div className="flex w-20 flex-col items-center gap-1 rounded-md border p-3">
            <span className="text-2xl font-semibold">{value ?? 0}</span>
            <span className="text-muted-foreground text-xs">{label}</span>
        </div>
    );
}

// ============================================================================
// Hero section (profile picture + username + stats)
// ============================================================================

function UserHero({ user, profile }: { user: UserDetailOutput['user']; profile: UserDetailOutput['profile'] }) {
    const initials = user.username.slice(0, 2).toUpperCase();
    const avatarUrl = profile?.profilePicture?.url || user.image;

    return (
        <div className="flex items-center gap-6 py-4">
            <Avatar className="h-16 w-16 shrink-0">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={user.username} />}
                <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
            <h1 className="shrink-0 text-2xl font-semibold">@{user.username}</h1>
            {profile && (
                <div className="ml-auto flex gap-2">
                    <StatCell label="Followers" value={profile.followersStat?.all} />
                    <StatCell label="Following" value={profile.followingStat?.all} />
                    <StatCell label="Spots" value={profile.spotsFollowingStat?.all} />
                    <StatCell label="Medias" value={profile.mediasStat?.all} />
                    <StatCell label="Clips" value={profile.clipsStat?.all} />
                    <StatCell label="Tricks" value={profile.tricksDoneStat?.all} />
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Cards
// ============================================================================

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
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
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

function AccountsCard({ accounts }: { accounts: UserDetailOutput['accounts'] }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CardTitle>Accounts</CardTitle>
                    <Badge variant="secondary">{accounts.length}</Badge>
                </div>
            </CardHeader>
            <CardContent className="grid gap-4">
                {accounts.length === 0 && <p className="text-muted-foreground text-sm">No linked accounts.</p>}
                {accounts.map((account, index) => (
                    <div key={account.id}>
                        {index > 0 && <Separator className="mb-4" />}
                        <div className="grid gap-3">
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Provider">
                                    <Badge variant="outline">{account.providerId}</Badge>
                                </Field>
                                <Field label="Account ID">
                                    <code className="text-xs">{account.accountId}</code>
                                </Field>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <Field label="Access Token">
                                    <Badge variant={account.hasAccessToken ? 'default' : 'outline'}>
                                        {account.hasAccessToken ? 'yes' : 'no'}
                                    </Badge>
                                </Field>
                                <Field label="Refresh Token">
                                    <Badge variant={account.hasRefreshToken ? 'default' : 'outline'}>
                                        {account.hasRefreshToken ? 'yes' : 'no'}
                                    </Badge>
                                </Field>
                                <Field label="ID Token">
                                    <Badge variant={account.hasIdToken ? 'default' : 'outline'}>
                                        {account.hasIdToken ? 'yes' : 'no'}
                                    </Badge>
                                </Field>
                            </div>
                            {(account.accessTokenExpiresAt || account.refreshTokenExpiresAt) && (
                                <div className="grid grid-cols-2 gap-4">
                                    <DateField label="Access Token Expires" value={account.accessTokenExpiresAt} />
                                    <DateField label="Refresh Token Expires" value={account.refreshTokenExpiresAt} />
                                </div>
                            )}
                            {account.scope && (
                                <Field label="Scope">
                                    <code className="text-xs">{account.scope}</code>
                                </Field>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <DateField label="Created" value={account.createdAt} />
                                <DateField label="Updated" value={account.updatedAt} />
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function ProfileCard({ profile }: { profile: UserDetailOutput['profile'] }) {
    if (!profile) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">No profile created.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                {/* Banner */}
                {profile.banner?.url && (
                    <div className="overflow-hidden rounded-md">
                        <img src={profile.banner.url} alt="Banner" className="h-32 w-full object-cover" />
                    </div>
                )}

                {/* Description */}
                {profile.description && (
                    <Field label="Description">
                        <span className="whitespace-pre-wrap">{profile.description}</span>
                    </Field>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Location">{profile.location ?? '-'}</Field>
                    <Field label="Stance">
                        {profile.stance ? <Badge variant="outline">{profile.stance.toLowerCase()}</Badge> : '-'}
                    </Field>
                </div>

                <Separator />

                {/* Social Links */}
                <div className="grid gap-2">
                    <span className="text-muted-foreground text-sm">Social Links</span>
                    <div className="flex flex-wrap gap-2">
                        {profile.instagram && (
                            <a
                                href={`https://instagram.com/${profile.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm underline"
                            >
                                <SiInstagram className="h-4 w-4" />
                                {profile.instagram}
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        )}
                        {profile.snapchat && (
                            <span className="inline-flex items-center gap-1 text-sm">
                                <Ghost className="h-4 w-4" />
                                {profile.snapchat}
                            </span>
                        )}
                        {profile.website && (
                            <a
                                href={profile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm underline"
                            >
                                <Globe className="h-4 w-4" />
                                {profile.website}
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        )}
                        {!profile.instagram && !profile.snapchat && !profile.website && (
                            <span className="text-muted-foreground text-sm">-</span>
                        )}
                    </div>
                </div>

                {/* Sponsors */}
                {profile.sponsors.length > 0 && (
                    <div className="grid gap-2">
                        <span className="text-muted-foreground text-sm">Sponsors</span>
                        <div className="flex flex-wrap gap-1">
                            {profile.sponsors.map((sponsor) => (
                                <Badge key={sponsor} variant="secondary">
                                    {sponsor}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                    <DateField label="Created" value={profile.createdAt} />
                    <DateField label="Updated" value={profile.updatedAt} />
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================================================
// Loading skeleton
// ============================================================================

function UserDetailSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6 py-4">
                <Skeleton className="h-16 w-16 shrink-0 rounded-full" />
                <Skeleton className="h-8 w-48 shrink-0" />
                <div className="ml-auto flex gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-16 rounded-md" />
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-24" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-8 w-full" />
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-8 w-full" />
                            ))}
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-24" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-32 w-full" />
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full" />
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// ============================================================================
// Page component
// ============================================================================

export default function UserDetailPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = use(params);

    const { data, isLoading, error } = useQuery(
        orpc.admin.users.getByUsername.queryOptions({
            input: { username },
        }),
    );

    if (error) {
        return (
            <>
                <SiteHeader title="User Not Found" />
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 pb-6 pt-4">
                    <p className="text-muted-foreground">
                        User <code>@{username}</code> was not found.
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <SiteHeader title={`User - @${data?.user.username || username}`} />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                {isLoading ? (
                    <UserDetailSkeleton />
                ) : data ? (
                    <>
                        <UserHero user={data.user} profile={data.profile} />
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="flex flex-col gap-6">
                                <UserInfoCard user={data.user} username={username} />
                                <AccountsCard accounts={data.accounts} />
                            </div>
                            <div>
                                <ProfileCard profile={data.profile} />
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </>
    );
}
