import React from 'react';
import SimpleBar, { Props as SimpleBarProps } from 'simplebar-react';

type Props = {
    maxHeight?: string;
    width?: string;
    children: React.ReactNode;
} & SimpleBarProps;

const ScrollBar = React.forwardRef<SimpleBar, Props>(function FowardSimpleBar(
    { children, maxHeight, width, ...props },
    ref,
) {
    const styles = {
        maxHeight,
        width,
    };

    return (
        <SimpleBar style={styles} ref={ref} {...props}>
            {children}
        </SimpleBar>
    );
});

export default ScrollBar;
