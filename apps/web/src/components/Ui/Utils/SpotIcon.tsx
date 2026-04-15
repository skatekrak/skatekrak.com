import { Status, Types } from '@krak/types';

import Diy from '@/components/pages/map/marker/icons/Diy';
import Park from '@/components/pages/map/marker/icons/Park';
import Private from '@/components/pages/map/marker/icons/Private';
import Rip from '@/components/pages/map/marker/icons/Rip';
import Shop from '@/components/pages/map/marker/icons/Shop';
import Street from '@/components/pages/map/marker/icons/Street';
import Wip from '@/components/pages/map/marker/icons/Wip';

const SpotIcon = ({ spot }: { spot: { status: Status; type: Types } }) => {
    if (spot.status === Status.Active) {
        switch (spot.type) {
            case Types.Street:
                return <Street />;
            case Types.Private:
                return <Private />;
            case Types.Diy:
                return <Diy />;
            case Types.Park:
                return <Park />;
            case Types.Shop:
                return <Shop />;
        }
    } else if (spot.status === Status.Rip) {
        return <Rip />;
    }
    return <Wip />;
};

export default SpotIcon;
