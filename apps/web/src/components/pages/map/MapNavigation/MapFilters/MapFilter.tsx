import { memo, CSSProperties } from 'react';
import { useShallow } from 'zustand/react/shallow';
import classnames from 'classnames';

import { Types, Status } from '@krak/carrelage-client';

import { useMapStore } from '@/store/map';

type MapFilterProps = {
    filter: Types | Status;
    icon: JSX.Element;
};

const gradientMap: Record<string, string> = {
    street: 'linear-gradient(#E34444, #8A2828)',
    park: 'linear-gradient(#50D4F1, #28798A)',
    diy: 'linear-gradient(#D55CFF, #71288A)',
    private: 'linear-gradient(#E7D533, #8A8128)',
    shop: 'linear-gradient(#5CE945, #368A28)',
    wip: 'linear-gradient(#FF791A, #93501F)',
    rip: 'linear-gradient(#FFFFFF, #8C8C8C)',
};

const MapFilter = ({ filter, icon }: MapFilterProps) => {
    const [filters, toggleFilter] = useMapStore(useShallow((state) => [state.filters, state.toggleFilter]));

    const handleOnClick = () => {
        toggleFilter(filter);
    };

    const isActive = filters.includes(filter);
    const isLoading = false;

    const showInactive = !isActive || isLoading;
    const showActiveGradient = isActive && !isLoading;

    return (
        <button
            className={classnames(
                'relative flex w-10 h-10 mr-2 bg-tertiary-dark bg-clip-padding border-[1.5px] border-transparent rounded-[0.2rem] shadow-onDarkHighSharp last:mr-0 [&_svg]:w-7 [&_svg]:m-auto',
                {
                    '[&_.map-icon-street-fill]:fill-tertiary-medium [&_.map-icon-park-fill]:fill-tertiary-medium [&_.map-icon-diy-fill]:fill-tertiary-medium [&_.map-icon-private-fill]:fill-tertiary-medium [&_.map-icon-shop-fill]:fill-tertiary-medium [&_.map-icon-wip-fill]:fill-tertiary-medium [&_.map-icon-rip-fill]:fill-tertiary-medium [&_.map-icon-wip-details]:fill-tertiary-medium [&_.details]:fill-tertiary-medium [&_.map-icon-stroke-outter]:fill-tertiary-light':
                        showInactive,
                    '[&_svg]:w-5 [&_.path]:stroke-[4px] [&_.path]:stroke-tertiary-light': isLoading,
                },
            )}
            onClick={handleOnClick}
        >
            <span
                className="absolute top-0 right-0 bottom-0 left-0 -m-[1.5px] rounded-[inherit] -z-[1]"
                style={
                    showActiveGradient
                        ? ({ background: gradientMap[filter] } as CSSProperties)
                        : ({ background: '#4D4D4D' } as CSSProperties)
                }
            />
            {icon}
        </button>
    );
};

export default memo(MapFilter);
