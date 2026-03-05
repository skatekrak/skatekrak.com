'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { PanelLeft } from 'lucide-react';

import { cn } from '../../lib/utils';
import { Button } from './button';
import { Separator } from './separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

// ============================================================================
// Constants
// ============================================================================

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_ICON = '3rem';

// ============================================================================
// Context
// ============================================================================

type SidebarContextValue = {
    state: 'expanded' | 'collapsed';
    open: boolean;
    setOpen: (open: boolean) => void;
    toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider.');
    }
    return context;
}

// ============================================================================
// Provider
// ============================================================================

function SidebarProvider({
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ...props
}: React.ComponentProps<'div'> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;

    const setOpen = React.useCallback(
        (value: boolean | ((value: boolean) => boolean)) => {
            const openState = typeof value === 'function' ? value(open) : value;
            if (setOpenProp) {
                setOpenProp(openState);
            } else {
                _setOpen(openState);
            }
            document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
        },
        [setOpenProp, open],
    );

    const toggleSidebar = React.useCallback(() => {
        setOpen((prev) => !prev);
    }, [setOpen]);

    const state = open ? 'expanded' : 'collapsed';

    const contextValue = React.useMemo<SidebarContextValue>(
        () => ({ state, open, setOpen, toggleSidebar }),
        [state, open, setOpen, toggleSidebar],
    );

    return (
        <SidebarContext.Provider value={contextValue}>
            <TooltipProvider delayDuration={0}>
                <div
                    data-slot="sidebar-wrapper"
                    style={
                        {
                            '--sidebar-width': SIDEBAR_WIDTH,
                            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
                            ...style,
                        } as React.CSSProperties
                    }
                    className={cn('group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar', className)}
                    {...props}
                >
                    {children}
                </div>
            </TooltipProvider>
        </SidebarContext.Provider>
    );
}

// ============================================================================
// Sidebar
// ============================================================================

function Sidebar({
    side = 'left',
    variant = 'sidebar',
    collapsible = 'offcanvas',
    className,
    children,
    ...props
}: React.ComponentProps<'div'> & {
    side?: 'left' | 'right';
    variant?: 'sidebar' | 'floating' | 'inset';
    collapsible?: 'offcanvas' | 'icon' | 'none';
}) {
    const { state } = useSidebar();

    if (collapsible === 'none') {
        return (
            <div
                data-slot="sidebar"
                className={cn('flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground', className)}
                {...props}
            >
                {children}
            </div>
        );
    }

    return (
        <div
            data-slot="sidebar"
            data-state={state}
            data-collapsible={state === 'collapsed' ? collapsible : ''}
            data-variant={variant}
            data-side={side}
            className="group peer hidden text-sidebar-foreground md:block"
        >
            {/* Gap element to keep layout spacing */}
            <div
                className={cn(
                    'relative w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear',
                    'group-data-[collapsible=offcanvas]:w-0',
                    'group-data-[side=right]:rotate-180',
                    variant === 'floating' || variant === 'inset'
                        ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
                        : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon]',
                )}
            />
            <div
                className={cn(
                    'fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex',
                    side === 'left'
                        ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
                        : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
                    variant === 'floating' || variant === 'inset'
                        ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]'
                        : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l',
                    className,
                )}
                {...props}
            >
                <div
                    data-sidebar="sidebar"
                    className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Sidebar sub-components
// ============================================================================

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
    const { toggleSidebar } = useSidebar();

    return (
        <Button
            data-slot="sidebar-trigger"
            data-sidebar="trigger"
            variant="ghost"
            size="icon"
            className={cn('size-7', className)}
            onClick={(event) => {
                onClick?.(event);
                toggleSidebar();
            }}
            {...props}
        >
            <PanelLeft />
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
    );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="sidebar-header" data-sidebar="header" className={cn('flex flex-col gap-2 p-2', className)} {...props} />;
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="sidebar-footer" data-sidebar="footer" className={cn('flex flex-col gap-2 p-2', className)} {...props} />;
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
    return <Separator data-slot="sidebar-separator" data-sidebar="separator" className={cn('mx-2 w-auto', className)} {...props} />;
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="sidebar-content"
            data-sidebar="content"
            className={cn('flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden', className)}
            {...props}
        />
    );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="sidebar-group"
            data-sidebar="group"
            className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
            {...props}
        />
    );
}

function SidebarGroupLabel({
    className,
    asChild = false,
    ...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'div';

    return (
        <Comp
            data-slot="sidebar-group-label"
            data-sidebar="group-label"
            className={cn(
                'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
                'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
                className,
            )}
            {...props}
        />
    );
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="sidebar-group-content" data-sidebar="group-content" className={cn('w-full text-sm', className)} {...props} />;
}

function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
    return (
        <ul
            data-slot="sidebar-menu"
            data-sidebar="menu"
            className={cn('flex w-full min-w-0 flex-col gap-1', className)}
            {...props}
        />
    );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
    return <li data-slot="sidebar-menu-item" data-sidebar="menu-item" className={cn('group/menu-item relative', className)} {...props} />;
}

function SidebarMenuButton({
    asChild = false,
    isActive = false,
    variant = 'default',
    size = 'default',
    tooltip,
    className,
    ...props
}: React.ComponentProps<'button'> & {
    asChild?: boolean;
    isActive?: boolean;
    variant?: 'default' | 'outline';
    size?: 'default' | 'sm' | 'lg';
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
}) {
    const Comp = asChild ? Slot : 'button';
    const { state } = useSidebar();

    const button = (
        <Comp
            data-slot="sidebar-menu-button"
            data-sidebar="menu-button"
            data-size={size}
            data-active={isActive}
            className={cn(
                'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground',
                size === 'sm' && 'h-7 text-xs',
                size === 'lg' && 'h-12 text-sm group-data-[collapsible=icon]:!p-0',
                'group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
                variant === 'outline' &&
                    'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
                className,
            )}
            {...props}
        />
    );

    if (!tooltip) {
        return button;
    }

    const tooltipProps = typeof tooltip === 'string' ? { children: tooltip } : tooltip;

    return (
        <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="right" align="center" hidden={state !== 'collapsed'} {...tooltipProps} />
        </Tooltip>
    );
}

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
    return (
        <main
            data-slot="sidebar-inset"
            className={cn(
                'relative flex min-h-svh flex-1 flex-col bg-background',
                'peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm',
                className,
            )}
            {...props}
        />
    );
}

export {
    Sidebar,
    SidebarContent,
    SidebarContext,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar,
};
