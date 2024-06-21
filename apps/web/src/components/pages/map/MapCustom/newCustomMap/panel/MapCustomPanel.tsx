import React, { useMemo, useState } from 'react';
import NextImage from 'next/image';

import IconArrow from '@/components/Ui/Icons/Arrow';
import MapLeftPanel from '@/components/pages/map/MapCustom/newCustomMap/MapLeftPanel';
import classNames from 'classnames';
import MapMedia from '@/components/pages/map/media/MapMedia';
import { useMedias } from '@/shared/feudartifice/hooks/media';
import { Spot } from '@krak/carrelage-client';
import { useCustomMapID, useSpotID, useSpotModal } from '@/lib/hook/queryState';

type Props = {
    id: string;
    title: string;
    about: string;
    spots: Spot[];
    videos: string[];
};

const MapCustomPanel = ({ id, title, about, spots, videos }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const [isReadMoreOpen, setIsReadMoreOpen] = useState(false);

    const [openTab, setOpenTab] = useState<'media' | 'video' | 'spots'>('media');

    const today = useMemo(() => {
        return new Date();
    }, []);

    const { data: medias } = useMedias({
        older: today,
        limit: 10,
        hashtag: id,
    });

    const [, setCustomMapID] = useCustomMapID();
    const [, setSpotID] = useSpotID();
    const [, setModalVisible] = useSpotModal();

    const goBack = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        setCustomMapID(null);
        setSpotID(null);
        setModalVisible(null);
    };

    return (
        <MapLeftPanel className="text-onDark-mediumEmphasis text-base overflow-y-auto">
            {/** Navigation */}
            <div className="flex justify-between py-4 px-6 border-b border-solid border-b-onDark-divider">
                <a className="group flex items-center gap-2 -ml-2 py-1 px-2 cursor-pointer" onClick={goBack}>
                    <IconArrow className="w-5 shrink-0 fill-onDark-mediumEmphasis group-hover:fill-onDark-highEmphasis rotate-180" />
                    <span className="whitespace-nowrap font-medium text-base group-hover:text-onDark-highEmphasis">
                        Krak Map
                    </span>
                </a>
                {isOpen ? (
                    <button className="" onClick={() => null}>
                        Reduce details
                    </button>
                ) : (
                    <div className="flex items-center gap-3 text-base" onClick={() => null}>
                        <NextImage
                            className="rounded-full"
                            src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            width={32}
                            height={32}
                            alt="custom map profile picture"
                        />
                        <span className="font-bold">{title}</span>
                    </div>
                )}
            </div>
            {/** Map profile */}
            <div className="flex flex-col py-4 px-6">
                <span>Category</span>
                <NextImage
                    className="mx-auto rounded-full"
                    // src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    src={`/images/map/custom-maps/${id}.png`}
                    width={120}
                    height={120}
                    alt="custom map profile picture"
                />
                <h2 className="mt-4 font-bold text-2xl text-center text-onDark-highEmphasis">{title}</h2>
                {about && (
                    <>
                        <p
                            className={classNames('mt-4 text-sm text-center', {
                                'line-clamp-4': !isReadMoreOpen,
                            })}
                        >
                            {about}
                        </p>
                        <button
                            className="mt-1 mx-auto p-1 text-sm underline"
                            onClick={() => setIsReadMoreOpen(!isReadMoreOpen)}
                        >
                            {isReadMoreOpen ? 'Hide' : 'Read more'}
                        </button>
                    </>
                )}
                {/** Tabs */}
                <div className="flex gap-6 justify-center my-8">
                    <Tab title="media" onClick={() => setOpenTab('media')} isActive={openTab === 'media'} />
                    <Tab title="video" onClick={() => setOpenTab('video')} isActive={openTab === 'video'} />
                    <Tab title="spots" onClick={() => setOpenTab('spots')} isActive={openTab === 'spots'} />
                </div>
                {/** Content */}
                <div className="flex flex-col gap-6">
                    {medias?.map((media) => <MapMedia key={media.id} media={media} isFromCustomMapFeed />)}
                </div>
            </div>
        </MapLeftPanel>
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
