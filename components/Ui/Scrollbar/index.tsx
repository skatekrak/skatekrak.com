import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

type Props = {
    maxHeight?: string;
};

const index: React.SFC<Props> = ({ children, maxHeight }) => {
    const renderThumb = ({ style, ...props }: any) => {
        return (
            <div
                style={{
                    ...style,
                    backgroundColor: '#333333',
                    borderRadius: '0.125rem',
                    width: '0.25rem',
                    marginLeft: 'auto',
                }}
                {...props}
            />
        );
    };

    return (
        <Scrollbars autoHeight autoHeightMax={maxHeight} renderThumbVertical={renderThumb}>
            {children}
        </Scrollbars>
    );
};

export default index;
