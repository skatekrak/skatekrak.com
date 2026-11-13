import { useState } from 'react';

import type { Country } from '@krak/contracts';

import { MapOverlayPanel } from '@/components/pages/map/_components';
import { VideoTabContent } from '@/components/pages/map/MapCustom/panel/Content';
import ScrollBar from '@/components/Ui/Scrollbar';
import { Tabs } from '@/components/Ui/Tabs';

import CountryImage from './CountryImage';

type Props = {
    country?: Country;
    loading: boolean;
    error: boolean;
    onRetry: () => void;
    onClose: () => void;
};

export default function CountryPanel({ country, loading, error, onRetry, onClose }: Props) {
    const [open, setOpen] = useState(true);
    const [tab, setTab] = useState<'about' | 'videos' | 'soundtrack'>('about');
    const hasAbout = Boolean(country?.edito || country?.about);
    // Fall through to the first visible tab when there is no editorial content
    const activeTab = hasAbout || tab !== 'about' ? tab : country?.videos.length ? 'videos' : 'soundtrack';

    return (
        <MapOverlayPanel collapsed={!open}>
            <MapOverlayPanel.Header>
                <span className="min-w-0 truncate font-medium text-onDark-highEmphasis">
                    {country?.name ?? 'Country'}
                </span>
                <div className="flex shrink-0 gap-2">
                    <button
                        type="button"
                        className="px-2 py-1 hover:text-onDark-highEmphasis"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? 'Hide panel' : 'Show panel'}
                    </button>
                    <button type="button" className="px-2 py-1 hover:text-onDark-highEmphasis" onClick={onClose}>
                        Close
                    </button>
                </div>
            </MapOverlayPanel.Header>
            {open && (
                <MapOverlayPanel.Body>
                    <ScrollBar maxHeight="100%">
                        {loading ? (
                            <p className="p-6" role="status">
                                Loading country...
                            </p>
                        ) : error ? (
                            <div className="p-6" role="alert">
                                <p>Could not load this country.</p>
                                <button type="button" className="py-2 underline" onClick={onRetry}>
                                    Try again
                                </button>
                            </div>
                        ) : !country ? (
                            <p className="p-6" role="status">
                                This country is not available.
                            </p>
                        ) : (
                            <>
                                <div className="flex flex-col items-center gap-4 px-6 py-6 text-center">
                                    <CountryImage country={country} />
                                    <h2 className="break-words text-2xl font-bold text-onDark-highEmphasis">
                                        {country.name}
                                    </h2>
                                    {country.subtitle && (
                                        <p className="whitespace-pre-wrap break-words text-sm">{country.subtitle}</p>
                                    )}
                                </div>
                                <Tabs value={activeTab} onValueChange={setTab}>
                                    <Tabs.List className="px-4">
                                        {hasAbout && <Tabs.Tab value="about">About</Tabs.Tab>}
                                        {country.videos.length > 0 && <Tabs.Tab value="videos">Videos</Tabs.Tab>}
                                        {country.soundtrack.length > 0 && (
                                            <Tabs.Tab value="soundtrack">Soundtrack</Tabs.Tab>
                                        )}
                                    </Tabs.List>
                                    <div className="px-6 pb-8 pt-4">
                                        <Tabs.Content
                                            value="about"
                                            className="flex flex-col gap-6 whitespace-pre-wrap break-words text-sm"
                                        >
                                            {country.edito && (
                                                <p className="font-medium text-onDark-highEmphasis">{country.edito}</p>
                                            )}
                                            {country.about && <p>{country.about}</p>}
                                        </Tabs.Content>
                                        <Tabs.Content value="videos" className="flex flex-col gap-6">
                                            <VideoTabContent videos={country.videos} />
                                        </Tabs.Content>
                                        <Tabs.Content value="soundtrack">
                                            <ul className="flex flex-col gap-4 text-sm">
                                                {country.soundtrack.map((track, index) => (
                                                    <li
                                                        key={`${index}-${track}`}
                                                        className="whitespace-pre-wrap break-words"
                                                    >
                                                        {track}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Tabs.Content>
                                    </div>
                                </Tabs>
                            </>
                        )}
                    </ScrollBar>
                </MapOverlayPanel.Body>
            )}
        </MapOverlayPanel>
    );
}
