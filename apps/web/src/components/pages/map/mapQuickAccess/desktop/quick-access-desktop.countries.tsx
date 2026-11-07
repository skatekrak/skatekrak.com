import { Globe } from 'lucide-react';

import CountriesList from '@/components/pages/map/countries/CountriesList';
import { useCountryID } from '@/lib/hook/queryState';

import QuickAccessDesktopPanel from './quick-access-desktop.panel';

export default function QuickAccessDesktopCountries() {
    const [countryId] = useCountryID();
    return (
        <QuickAccessDesktopPanel
            isSelected={countryId != null}
            icon={<Globe className="size-7" aria-hidden="true" />}
            tooltipText="Countries"
            panelContent={(close) => <CountriesList onSelect={close} />}
        />
    );
}
