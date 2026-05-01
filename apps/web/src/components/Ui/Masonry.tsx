import React from 'react';
import Masonry, { MasonryProps } from 'react-masonry-css';

import styles from './masonry.module.css';

type KrakMasonryProps = Partial<MasonryProps>;

const KrakMasonry: React.FC<KrakMasonryProps & { children: React.ReactNode }> = ({ children, ...props }) => (
    <Masonry className={styles['masonry-grid']} columnClassName={styles['masonry-grid_column']} {...props}>
        {children}
    </Masonry>
);

export default KrakMasonry;
