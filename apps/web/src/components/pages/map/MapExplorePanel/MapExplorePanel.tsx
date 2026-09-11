import { PanelLeftClose } from 'lucide-react';
import { useCallback, useState } from 'react';

import type { Spot } from '@krak/contracts';

import { MapOverlayPanel } from '@/components/pages/map/MapOverlayPanel';
import ScrollBar from '@/components/Ui/Scrollbar';
import { Tabs } from '@/components/Ui/Tabs';
import Typography from '@/components/Ui/typography/Typography';
import { useSpotID } from '@/lib/hook/queryState';
import { useMapStore } from '@/store/map';

import { MapExplorePanelMedia } from './MapExplorePanelMedia';
import { MapExplorePanelSpots } from './MapExplorePanelSpots';

import type { MapBounds } from '@/lib/hook/useSpotsGeoJSON';

type MapExplorePanelTab = 'media' | 'spots';

type MapExplorePanelProps = {
    bounds?: MapBounds;
};

const MapExplorePanel = ({ bounds }: MapExplorePanelProps) => {
    const toggleSidePanel = useMapStore((state) => state.toggleSidePanel);
    const [_, setSpotID] = useSpotID();
    const [openTab, setOpenTab] = useState<MapExplorePanelTab>('media');

    const onSpotClick = useCallback(
        (spot: Spot) => {
            setSpotID(spot.id);
        },
        [setSpotID],
    );

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
                                    <MapExplorePanelMedia bounds={bounds} onSpotClick={onSpotClick} />
                                </Tabs.Content>
                                <Tabs.Content value="spots">
                                    <MapExplorePanelSpots bounds={bounds} onSpotClick={onSpotClick} />
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
