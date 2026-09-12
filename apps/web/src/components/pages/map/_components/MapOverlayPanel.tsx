import { cn } from '@krak/ui';

import type { ReactNode } from 'react';

/** Offset map chrome to the right of an open overlay panel, keeping the usual screen inset. */
export const mapPanelOffset = 'laptop-s:left-[calc(var(--container-lg)+1.5rem)]';

/** Pixel width of MapOverlayPanel at laptop-s+ (`w-lg` / `--container-lg` = 32rem). */
export const mapOverlayPanelWidthPx = 512;

type MapOverlayPanelProps = {
    children: ReactNode;
    collapsed?: boolean;
    className?: string;
};

const Root = ({ children, collapsed = false, className }: MapOverlayPanelProps) => (
    <div
        className={cn(
            'absolute inset-0 laptop-s:right-auto laptop-s:w-lg flex flex-col text-onDark-mediumEmphasis text-base bg-tertiary-dark border-r border-solid border-tertiary-medium shadow-2xl z-1010 overflow-hidden',
            collapsed && 'bottom-auto',
            className,
        )}
    >
        {children}
    </div>
);

type HeaderProps = {
    children: ReactNode;
    className?: string;
};

const Header = ({ children, className }: HeaderProps) => (
    <div
        className={cn(
            'shrink-0 flex items-center justify-between py-3 px-6 max-tablet:py-2 border-b border-solid border-b-onDark-divider',
            className,
        )}
    >
        {children}
    </div>
);

type BodyProps = {
    children: ReactNode;
    className?: string;
};

const Body = ({ children, className }: BodyProps) => (
    <div className={cn('min-h-0 grow flex flex-col overflow-hidden', className)}>{children}</div>
);

export const MapOverlayPanel = Object.assign(Root, {
    Header,
    Body,
});
