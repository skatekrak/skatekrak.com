'use client';

import { LayoutDashboard, Map, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@krak/ui';

import { NavUser } from '@/components/nav-user';

const mainItems = [
    {
        title: 'Home',
        href: '/',
        icon: LayoutDashboard,
    },
];

const managementItems = [
    {
        title: 'Users',
        href: '/users',
        icon: Users,
    },
    {
        title: 'Spots',
        href: '/spots',
        icon: MapPin,
    },
    {
        title: 'Maps',
        href: '/maps',
        icon: Map,
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <Link href="/" className="flex flex-row gap-x-2 px-1 py-2 items-center">
                    <LayoutDashboard />
                    <span className="text-base font-semibold">Manager</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)}
                                    >
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {managementItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
