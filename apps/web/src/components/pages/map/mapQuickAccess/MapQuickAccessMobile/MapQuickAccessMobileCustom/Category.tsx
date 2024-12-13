import React, { useState } from 'react';

import Map from '../../MapQuickAccessDesktop/Maps/Map';

import { Category as TCategory } from '../../types';
import ArrowHead from '@/components/Ui/Icons/ArrowHead';
import Typography from '@/components/Ui/typography/Typography';
import classNames from 'classnames';

type Props = {
    category: TCategory;
    onMapClick: () => void;
};

const Category = ({ category, onMapClick }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="text-onDark-highEmphasis">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-4 px-6 border-t border-onDark-divider"
            >
                <Typography component="condensedHeading6" className="text-onDark-mediumEmphasis">
                    {category.name}
                </Typography>
                <ArrowHead
                    className={classNames('w-6 fill-onDark-lowEmphasis', {
                        '-rotate-90': isOpen,
                        'rotate-90': !isOpen,
                    })}
                />
            </button>
            {isOpen && (
                <div className="flex flex-col gap-2 p-2">
                    {category.maps.map((map) => (
                        <Map
                            key={map.id}
                            map={map}
                            onClick={() => {
                                setIsOpen(false);
                                onMapClick();
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Category;
