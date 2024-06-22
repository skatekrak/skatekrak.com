import React, { useEffect, useState } from 'react';
import NextImage from 'next/image';
import classNames from 'classnames';

import IconArrow from '@/components/Ui/Icons/Arrow';
import { useCustomMapID, useMediaID, useSpotID, useSpotModal } from '@/lib/hook/queryState';
import Content from '@/components/pages/map/MapCustom/panel/Content';
import { CustomMap } from '@/lib/map/types';
import { Spot } from '@krak/carrelage-client';
import MapCustomMediaCarousel from '@/components/pages/map/MapCustom/MapCustomMediaCarousel';

export type MapCustomPanelTabs = 'media' | 'video' | 'spots';

type Props = {
    map: CustomMap;
    spots: Spot[];
};

const MapCustomPanel = ({ map, spots }: Props) => {
    const { id, name, about, categories } = map;

    const [isOpen, setIsOpen] = useState(true);

    const [showReadMore, setShowReadMore] = useState(false);
    const [isReadMoreOpen, setIsReadMoreOpen] = useState(false);

    useEffect(() => {
        const aboutElement = document.getElementById('map-custom-panel-about');
        if (aboutElement && aboutElement.clientHeight >= 80) {
            setShowReadMore(true);
        }
    }, [id]);

    const [openTab, setOpenTab] = useState<MapCustomPanelTabs>('media');

    const [, setCustomMapID] = useCustomMapID();
    const [, setSpotID] = useSpotID();
    const [, setModalVisible] = useSpotModal();

    const goBack = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        setCustomMapID(null);
        setSpotID(null);
        setModalVisible(null);
    };

    const [mediaId] = useMediaID();

    return (
        <>
            {mediaId && <MapCustomMediaCarousel initialMediaId={mediaId} hashtag={id} />}
            <div
                className={classNames(
                    'absolute inset-0 lg:right-auto lg:w-[32rem] flex flex-col text-onDark-mediumEmphasis text-base bg-tertiary-dark border-r border-solid border-tertiary-medium shadow-2xl z-[1010] overflow-y-auto',
                    { 'bottom-auto': !isOpen },
                )}
            >
                {/** Navigation */}
                <div className="flex justify-between py-4 px-6 border-b border-solid border-b-onDark-divider">
                    <a className="group flex items-center gap-2 -ml-2 py-1 px-2 cursor-pointer" onClick={goBack}>
                        <IconArrow className="w-5 shrink-0 fill-onDark-mediumEmphasis group-hover:fill-onDark-highEmphasis rotate-180" />
                        <span className="whitespace-nowrap font-medium text-base group-hover:text-onDark-highEmphasis">
                            Krak Map
                        </span>
                    </a>
                    {isOpen ? (
                        <button
                            className="-mr-2 py-1 px-2 hover:text-onDark-highEmphasis"
                            onClick={() => setIsOpen(false)}
                        >
                            Reduce details
                        </button>
                    ) : (
                        <button className="flex items-center gap-3 text-base" onClick={() => setIsOpen(true)}>
                            <NextImage
                                className="rounded-full"
                                src={`/images/map/custom-maps/${id}.png`}
                                width={32}
                                height={32}
                                alt="custom map profile picture"
                            />
                            <span className="font-bold text-onDark-highEmphasis">{name}</span>
                        </button>
                    )}
                </div>
                {/** Map profile */}
                {isOpen && (
                    <>
                        <div className="flex flex-col pt-4 px-6">
                            <span className="font-medium capitalize">{categories[0]}</span>
                            <NextImage
                                className="mx-auto rounded-full"
                                src={`/images/map/custom-maps/${id}.png`}
                                width={120}
                                height={120}
                                alt="custom map profile picture"
                                priority={true}
                            />
                            <h2 className="mt-4 font-bold text-2xl text-center text-onDark-highEmphasis">{name}</h2>
                            {about && (
                                <>
                                    <p
                                        id="map-custom-panel-about"
                                        className={classNames('mt-4 text-sm text-center', {
                                            'line-clamp-4': !isReadMoreOpen,
                                        })}
                                    >
                                        {about}
                                    </p>
                                    {showReadMore && (
                                        <button
                                            className="mt-1 mx-auto p-1 text-sm underline"
                                            onClick={() => setIsReadMoreOpen(!isReadMoreOpen)}
                                        >
                                            {isReadMoreOpen ? 'Hide' : 'Read more'}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                        {/** Tabs */}
                        <div className="flex gap-6 justify-center flex-wrap my-8 px-6">
                            <Tab title="media" onClick={() => setOpenTab('media')} isActive={openTab === 'media'} />
                            <Tab title="video" onClick={() => setOpenTab('video')} isActive={openTab === 'video'} />
                            <Tab title="spots" onClick={() => setOpenTab('spots')} isActive={openTab === 'spots'} />
                        </div>
                        {/** Content */}
                        <div className="grow flex flex-col gap-6 px-6 pb-8">
                            <Content map={map} activeTab={openTab} spots={spots} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default MapCustomPanel;

const Tab = ({
    title,
    isActive,
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { title: string; isActive: boolean }) => (
    <button
        className={classNames(
            'relative pt-1 pb-3 px-4 text-lg font-bold hover:text-onDark-highEmphasis',
            {
                'text-onDark-highEmphasis': isActive,
            },
            className,
        )}
        {...props}
    >
        {title}
        {isActive && <div className="absolute -bottom-0.5 inset-x-2 h-0.5 bg-primary-100" />}
    </button>
);
