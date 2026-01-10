import React, { useState } from 'react';
import classNames from 'classnames';

import { generateCategories } from '../utils';
import { trpc } from '@/server/trpc/utils';
import { Category as TCategory } from '../types';
import Typography from '@/components/Ui/typography/Typography';
import ArrowHead from '@/components/Ui/Icons/ArrowHead';
import Map from '../Map';

type Props = {
    closeSheet: () => void;
};

const MobileMaps: React.FC<Props> = ({ closeSheet }) => {
    const { isLoading, data } = trpc.maps.list.useQuery();

    return (
        <div className="block">
            {!isLoading &&
                data &&
                generateCategories(data).map((category) => (
                    <Category key={category.id} category={category} onMapClick={closeSheet} />
                ))}
        </div>
    );
};

export default MobileMaps;

type CategoryProps = {
    category: TCategory;
    onMapClick: () => void;
};

const Category = ({ category, onMapClick }: CategoryProps) => {
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