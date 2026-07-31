import classnames from 'classnames';
import { useField } from 'formik';

import { Types } from '@krak/types';

import Diy from '@/components/pages/map/marker/icons/Diy';
import Park from '@/components/pages/map/marker/icons/Park';
import Private from '@/components/pages/map/marker/icons/Private';
import Shop from '@/components/pages/map/marker/icons/Shop';
import Street from '@/components/pages/map/marker/icons/Street';
import Typography from '@/components/Ui/typography/Typography';

const MapCreateSpotType = () => {
    const [{ value: type }, , helpers] = useField<Types>('type');

    const onTypeClick = (selectedType: Types) => {
        helpers.setValue(selectedType);
    };

    return (
        <>
            <Typography component="button" className="p-6 tablet:px-8 tablet:py-5">
                Select a type
            </Typography>
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
        </>
    );
};

export default MapCreateSpotType;
