import React from 'react';
import NextImage from 'next/image';
import classNames from 'classnames';

import useRemPX from '@/lib/useRemPX';

type Props = {
    selected: boolean;
    src: string;
    alt?: string;
    /** width and height unit */
    size?: string;
};

/** Used to display a rounded image for QuickAccess maps */
const RoundedImage = ({ selected, src, alt, size = '2.5rem' }: Props) => {
    const px = useRemPX(size);
    return (
        <div
            className={classNames('relative', {
                'after:absolute after:inset-y-0 after:-left-3 after:block after:w-0.5 after:bg-primary-80': selected,
            })}
        >
            <NextImage
                width={px}
                height={px}
                src={src}
                alt={alt ?? ''}
                className="block bg-tertiary-medium border border-solid border-tertiary-light rounded-full"
            />
        </div>
    );
};

export default RoundedImage;
