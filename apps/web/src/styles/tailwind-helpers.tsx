import React from 'react';

export const TailwindElementFactory = <E extends React.ElementType>(
    element: E,
    { className: baseClassName, ...baseProps }: React.ComponentPropsWithRef<E>,
) => {
    const el = React.forwardRef(({ className, ...props }: React.ComponentProps<E>, ref) =>
        React.createElement(element, {
            className: `${baseClassName} ${className}`,
            ref,
            ...baseProps,
            ...props,
        }),
    );
    el.displayName = 'TailwindElement';
    return el;
};
