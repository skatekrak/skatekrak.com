import React, { Ref } from 'react';
import SimpleBar from 'simplebar-react';

type Props = {
    maxHeight?: string;
    ref?: Ref<SimpleBar>;
};

const index: React.FC<Props> = React.forwardRef(({ children, maxHeight }, ref) => {
    const styles = {
        maxHeight,
    };

    return (
        <SimpleBar style={styles} ref={ref}>
            {children}
        </SimpleBar>
    );
});

export default index;
