import classNames from 'classnames';
import React, { createContext, useContext } from 'react';

import { cn } from '@krak/ui';

type TabsContextValue = {
    value: string;
    onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs compound components must be used within <Tabs>');
    }
    return context;
};

type TabsProps<T extends string = string> = {
    value: T;
    onValueChange: (value: T) => void;
    children: React.ReactNode;
    className?: string;
};

const TabsRoot = <T extends string = string>({ value, onValueChange, children, className }: TabsProps<T>) => (
    <TabsContext.Provider value={{ value, onValueChange: onValueChange as (value: string) => void }}>
        <div className={className}>{children}</div>
    </TabsContext.Provider>
);

type ListProps = {
    children: React.ReactNode;
    className?: string;
};

const List = ({ children, className }: ListProps) => (
    <div role="tablist" className={classNames('flex gap-x-6 gap-y-4 justify-center flex-wrap', className)}>
        {children}
    </div>
);

type TabProps = {
    value: string;
    children?: React.ReactNode;
    className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'children'>;

const Tab = ({ value, children, className, onClick, ...props }: TabProps) => {
    const { value: activeValue, onValueChange } = useTabsContext();
    const isActive = activeValue === value;

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            className={cn(
                'relative pt-1 pb-3 px-4 text-lg font-bold text-onDark-mediumEmphasis hover:text-onDark-highEmphasis',
                {
                    'text-onDark-highEmphasis': isActive,
                },
                className,
            )}
            onClick={(event) => {
                onValueChange(value);
                onClick?.(event);
            }}
            {...props}
        >
            {children}
            {isActive && <div className="absolute -bottom-0.5 inset-x-2 h-0.5 bg-primary-100" />}
        </button>
    );
};

type ContentProps = {
    value: string;
    children?: React.ReactNode;
    className?: string;
    /** Keep the panel mounted even when inactive */
    forceMount?: boolean;
};

const Content = ({ value, children, className, forceMount }: ContentProps) => {
    const { value: activeValue } = useTabsContext();
    const isActive = activeValue === value;

    if (!forceMount && !isActive) {
        return null;
    }

    return (
        <div role="tabpanel" hidden={!isActive} className={className}>
            {children}
        </div>
    );
};

export const Tabs = Object.assign(TabsRoot, {
    List,
    Tab,
    Content,
});

export { Content, List, Tab };
