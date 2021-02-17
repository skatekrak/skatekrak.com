import React from 'react';
import Masonry, { MasonryProps } from 'react-masonry-css';

type KrakMasonryProps = Partial<MasonryProps>;

const KrakMasonry: React.FC<KrakMasonryProps> = ({ children, ...props }) => (
    <Masonry className="masonry-grid" columnClassName="masonry-grid_column" {...props}>
        {children}
    </Masonry>
);

export default KrakMasonry;
