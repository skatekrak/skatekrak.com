import { SidebarProvider, SidebarInset, SidebarTrigger, Separator } from '@krak/ui';

import { AppSidebar } from '@/components/app-sidebar';
import { AuthGuard } from '@/components/auth-guard';
import { ThemeToggle } from '@/components/theme-toggle';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4!" />
                        <span className="text-sm font-medium text-muted-foreground">Admin Dashboard</span>
                        <div className="ml-auto">
                            <ThemeToggle />
                        </div>
                    </header>
                    <div className="flex-1 p-6">{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </AuthGuard>
    );
}
