import { SidebarProvider, SidebarInset } from '@krak/ui';

import { AppSidebar } from '@/components/app-sidebar';
import { AuthGuard } from '@/components/auth-guard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>{children}</SidebarInset>
            </SidebarProvider>
        </AuthGuard>
    );
}
