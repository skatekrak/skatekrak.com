import { PanelLeftClose } from 'lucide-react';
import { useState } from 'react';

import { BoundedMediaFeed, BoundedSpotFeed, MapOverlayPanel } from '@/components/pages/map/_components';
import ScrollBar from '@/components/Ui/Scrollbar';
import { Tabs } from '@/components/Ui/Tabs';
import Typography from '@/components/Ui/typography/Typography';
import { useMapStore } from '@/store/map';

import type { MapBounds } from '@/lib/hook/useSpotsGeoJSON';

type MapExplorePanelTab = 'media' | 'spots';

type MapExplorePanelProps = {
    bounds?: MapBounds;
};

const MapExplorePanel = ({ bounds }: MapExplorePanelProps) => {
    const toggleSidePanel = useMapStore((state) => state.toggleSidePanel);

    const [openTab, setOpenTab] = useState<MapExplorePanelTab>('media');

    return (
        <MapOverlayPanel>
            <MapOverlayPanel.Header className="flex-col items-stretch px-8 py-6 border-b-0">
                <div className="flex items-center justify-between">
                    <Typography component="condensedHeading4" className="mb-2 text-onDark-highEmphasis">
                        Explore
                    </Typography>
                    <button type="button" onClick={() => toggleSidePanel(false)}>
                        <PanelLeftClose className="text-tertiary-white opacity-70" />
                    </button>
                </div>
                <Typography component="body1" className="text-onDark-mediumEmphasis">
                    Discover spots or media from the map
                </Typography>
            </MapOverlayPanel.Header>
            <MapOverlayPanel.Body>
                <Tabs value={openTab} onValueChange={setOpenTab} className="min-h-0 grow flex flex-col">
                    <Tabs.List className="shrink-0 px-8">
                        <Tabs.Tab value="media">Media</Tabs.Tab>
                        <Tabs.Tab value="spots">Spots</Tabs.Tab>
                    </Tabs.List>
                    <div key={openTab} className="min-h-0 grow">
                        <ScrollBar maxHeight="100%">
                            <div className="px-8 pb-8">
                                <Tabs.Content value="media">
                                    <BoundedMediaFeed bounds={bounds} />
                                </Tabs.Content>
                                <Tabs.Content value="spots">
                                    <BoundedSpotFeed bounds={bounds} />
                                </Tabs.Content>
                            </div>
                        </ScrollBar>
                    </div>
                </Tabs>
            </MapOverlayPanel.Body>
        </MapOverlayPanel>
    );
};

export default MapExplorePanel;
