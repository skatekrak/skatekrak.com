import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { KrakImage } from '@krak/ui';

import Typography from '@/components/Ui/typography/Typography';
import { useCityID, useCustomMapID, useMediaID, useSpotID, useSpotModal } from '@/lib/hook/queryState';
import { useMapStore } from '@/store/map';

import { QuickAccessMap } from './types';

type MapProps = {
    map: QuickAccessMap;
    onClick: () => void;
};

const Map: React.FC<MapProps> = ({ map, onClick }) => {
    const router = useRouter();
    const [toggleLegend, toggleSearchResult] = useMapStore(
        useShallow((state) => [state.toggleLegend, state.toggleSearchResult]),
    );
    const [, setCustomMapID] = useCustomMapID();
    const [, setCityID] = useCityID();
    const [, setModalVisible] = useSpotModal();
    const [, setSpotID] = useSpotID();
    const [, setMediaID] = useMediaID();

    const isMapSelected = useMemo(() => {
        return router.query.id === map.id;
    }, [router.query.id, map.id]);

    const handleClick = (e: React.SyntheticEvent) => {
        e.preventDefault();
        toggleLegend(false);
        toggleSearchResult(false);

        setCustomMapID(map.id);
        setCityID(null);
        setSpotID(null);
        setModalVisible(null);
        setMediaID(null);

        onClick();
    };

    return (
        <button
            onClick={handleClick}
            className="flex flex-col w-full border border-onDark-divider rounded-lg hover:border-onDark-placeholder hover:shadow-[1px_5px_24px_1px_rgba(0,0,0,0.24)]"
        >
            <div className="flex items-center w-full py-2 px-3">
                <div
                    className={classNames('relative shrink-0', {
                        'after:absolute after:inset-y-0 after:-left-3 after:block after:w-0.5 after:bg-primary-80':
                            isMapSelected,
                    })}
                >
                    <KrakImage
                        path={`assets/maps/custom-maps/${map.id}.png`}
                        options={{ width: 48, height: 48, resizingType: 'fill' }}
                        alt={map.name}
                        className="block size-12 rounded-full border border-solid border-tertiary-light bg-tertiary-medium"
                    />
                </div>
                <Typography
                    component="condensedSubtitle1"
                    truncateLines={1}
                    className="mx-4 text-left text-onDark-mediumEmphasis whitespace-normal"
                >
                    {map.name}
                </Typography>
            </div>
        </button>
    );
};

export default React.memo(Map);
