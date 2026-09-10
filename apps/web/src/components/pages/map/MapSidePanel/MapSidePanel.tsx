import { PanelLeftClose } from 'lucide-react';
import { useState } from 'react';

import type { Spot } from '@krak/contracts';

import { MapOverlayPanel } from '@/components/pages/map/MapOverlayPanel';
import ScrollBar from '@/components/Ui/Scrollbar';
import { Tabs } from '@/components/Ui/Tabs';
import Typography from '@/components/Ui/typography/Typography';
import { useMapStore } from '@/store/map';

import { MapSidePanelMedia } from './MapSidePanelMedia';
import { MapSidePanelSpots } from './MapSidePanelSpots';

import type { MapBounds } from '@/lib/hook/useSpotsGeoJSON';

type MapSidePanelTab = 'media' | 'spots';

type MapSidePanelProps = {
    bounds?: MapBounds;
    onSpotClick: (spot: Spot) => void;
};

const MapSidePanel = ({ bounds, onSpotClick }: MapSidePanelProps) => {
    const toggleSidePanel = useMapStore((state) => state.toggleSidePanel);
    const [openTab, setOpenTab] = useState<MapSidePanelTab>('media');

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
                                    <MapSidePanelMedia bounds={bounds} onSpotClick={onSpotClick} />
                                </Tabs.Content>
                                <Tabs.Content value="spots">
                                    <MapSidePanelSpots bounds={bounds} onSpotClick={onSpotClick} />
                                </Tabs.Content>
                            </div>
                        </ScrollBar>
                    </div>
                </Tabs>
            </MapOverlayPanel.Body>
        </MapOverlayPanel>
    );
};

export default MapSidePanel;
