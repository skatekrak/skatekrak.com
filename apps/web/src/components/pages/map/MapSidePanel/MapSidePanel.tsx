import { PanelLeftClose } from 'lucide-react';
import { useState } from 'react';

import { Tabs } from '@/components/Ui/Tabs';
import Typography from '@/components/Ui/typography/Typography';
import { useMapStore } from '@/store/map';

import { MapSidePanelMedia } from './MapSidePanelMedia';
import { MapSidePanelSpots } from './MapSidePanelSpots';

type MapSidePanelTab = 'media' | 'spots';

const MapSidePanel = () => {
    const toggleSidePanel = useMapStore((state) => state.toggleSidePanel);
    const [openTab, setOpenTab] = useState<MapSidePanelTab>('media');

    return (
        <div className="w-lg bg-tertiary-dark border-r border-solid border-tertiary-medium">
            <div className="flex flex-col px-8 py-6">
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
            </div>
            <Tabs value={openTab} onValueChange={setOpenTab}>
                <Tabs.List className="px-8">
                    <Tabs.Tab value="media">Media</Tabs.Tab>
                    <Tabs.Tab value="spots">Spots</Tabs.Tab>
                </Tabs.List>
                <div className="grow flex flex-col gap-6 px-8 pb-8">
                    <Tabs.Content value="media">
                        <MapSidePanelMedia />
                    </Tabs.Content>
                    <Tabs.Content value="spots">
                        <MapSidePanelSpots />
                    </Tabs.Content>
                </div>
            </Tabs>
        </div>
    );
};

export default MapSidePanel;
