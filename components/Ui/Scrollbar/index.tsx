import React from 'react';
import SimpleBar from 'simplebar-react';

type Props = {
    maxHeight?: string;
};

const index: React.SFC<Props> = ({ children, maxHeight }) => {
    const styles = {
        maxHeight,
    };

    return <SimpleBar style={styles}>{children}</SimpleBar>;
};

export default index;
