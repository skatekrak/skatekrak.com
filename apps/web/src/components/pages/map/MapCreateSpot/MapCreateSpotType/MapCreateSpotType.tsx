import React, { useState } from 'react';
import classnames from 'classnames';
import { Types } from '@/shared/feudartifice/types';

import IconEdit from '@/components/Ui/Icons/IconEdit';
import IconPlus from '@/components/Ui/Icons/IconPlus';
import Street from '@/components/pages/map/marker/icons/Street';
import Park from '@/components/pages/map/marker/icons/Park';
import Shop from '@/components/pages/map/marker/icons/Shop';
import Private from '@/components/pages/map/marker/icons/Private';
import Diy from '@/components/pages/map/marker/icons/Diy';
import Typography from '@/components/Ui/typography/Typography';
import { useField } from 'formik';

const MapCreateSpotType = () => {
    const [{ value: type }, , helpers] = useField<Types>('type');
    const [isSelectTypeOpen, setIsSelectTypeOpen] = useState(false);

    const handleTypeBarClick = () => setIsSelectTypeOpen(!isSelectTypeOpen);

    const onTypeClick = (type: Types) => {
        helpers.setValue(type);
        setIsSelectTypeOpen(false);
    };

    return (
        <>
            <button
                className="flex items-center justify-between w-full p-6 tablet:px-8 tablet:py-5"
                onClick={handleTypeBarClick}
            >
                {type != null ? (
                    <>
                        <div className="flex items-center grow text-onDark-highEmphasis [&_svg]:w-10 [&_svg]:mr-2">
                            {type === 'street' && <Street />}
                            {type === 'park' && <Park />}
                            {type === 'shop' && <Shop />}
                            {type === 'private' && <Private />}
                            {type === 'diy' && <Diy />}
                            <Typography component="heading6">{type}</Typography>
                        </div>
                        <div className="flex items-center text-onDark-mediumEmphasis [&_.ui-Typography]:shrink-0 [&_svg]:shrink-0 [&_svg]:w-5 [&_svg]:ml-3 [&_svg]:fill-onDark-mediumEmphasis">
                            <Typography component="button">Edit</Typography>
                            <IconEdit />
                        </div>
                    </>
                ) : (
                    <div className="flex items-center text-onDark-mediumEmphasis [&_.ui-Typography]:shrink-0 [&_svg]:shrink-0 [&_svg]:w-5 [&_svg]:ml-3 [&_svg]:fill-onDark-mediumEmphasis">
                        <Typography component="button">Select type</Typography>
                        <IconPlus />
                    </div>
                )}
            </button>
            {isSelectTypeOpen && (
                <div className="grid grid-cols-5 gap-6 px-6 pb-6 tablet:px-8 tablet:pb-5">
                    <button
                        className={classnames('mx-auto text-onDark-mediumEmphasis [&_svg]:w-10', {
                            '[&_.map-icon-stroke-outter]:fill-onDark-lowEmphasis [&_.map-icon-street-fill]:fill-tertiary-light [&_.map-icon-park-fill]:fill-tertiary-light [&_.map-icon-shop-fill]:fill-tertiary-light [&_.map-icon-private-fill]:fill-tertiary-light [&_.map-icon-diy-fill]:fill-tertiary-light':
                                type !== Types.Street,
                        })}
                        onClick={() => onTypeClick(Types.Street)}
                    >
                        <Street />
                        <Typography component="caption">Street</Typography>
                    </button>
                    <button
                        className={classnames('mx-auto text-onDark-mediumEmphasis [&_svg]:w-10', {
                            '[&_.map-icon-stroke-outter]:fill-onDark-lowEmphasis [&_.map-icon-street-fill]:fill-tertiary-light [&_.map-icon-park-fill]:fill-tertiary-light [&_.map-icon-shop-fill]:fill-tertiary-light [&_.map-icon-private-fill]:fill-tertiary-light [&_.map-icon-diy-fill]:fill-tertiary-light':
                                type !== Types.Park,
                        })}
                        onClick={() => onTypeClick(Types.Park)}
                    >
                        <Park />
                        <Typography component="caption">Park</Typography>
                    </button>
                    <button
                        className={classnames('mx-auto text-onDark-mediumEmphasis [&_svg]:w-10', {
                            '[&_.map-icon-stroke-outter]:fill-onDark-lowEmphasis [&_.map-icon-street-fill]:fill-tertiary-light [&_.map-icon-park-fill]:fill-tertiary-light [&_.map-icon-shop-fill]:fill-tertiary-light [&_.map-icon-private-fill]:fill-tertiary-light [&_.map-icon-diy-fill]:fill-tertiary-light':
                                type !== Types.Shop,
                        })}
                        onClick={() => onTypeClick(Types.Shop)}
                    >
                        <Shop />
                        <Typography component="caption">Shop</Typography>
                    </button>
                    <button
                        className={classnames('mx-auto text-onDark-mediumEmphasis [&_svg]:w-10', {
                            '[&_.map-icon-stroke-outter]:fill-onDark-lowEmphasis [&_.map-icon-street-fill]:fill-tertiary-light [&_.map-icon-park-fill]:fill-tertiary-light [&_.map-icon-shop-fill]:fill-tertiary-light [&_.map-icon-private-fill]:fill-tertiary-light [&_.map-icon-diy-fill]:fill-tertiary-light':
                                type !== Types.Private,
                        })}
                        onClick={() => onTypeClick(Types.Private)}
                    >
                        <Private />
                        <Typography component="caption">Private</Typography>
                    </button>
                    <button
                        className={classnames('mx-auto text-onDark-mediumEmphasis [&_svg]:w-10', {
                            '[&_.map-icon-stroke-outter]:fill-onDark-lowEmphasis [&_.map-icon-street-fill]:fill-tertiary-light [&_.map-icon-park-fill]:fill-tertiary-light [&_.map-icon-shop-fill]:fill-tertiary-light [&_.map-icon-private-fill]:fill-tertiary-light [&_.map-icon-diy-fill]:fill-tertiary-light':
                                type !== Types.Diy,
                        })}
                        onClick={() => onTypeClick(Types.Diy)}
                    >
                        <Diy />
                        <Typography component="caption">Diy</Typography>
                    </button>
                </div>
            )}
        </>
    );
};

export default MapCreateSpotType;
