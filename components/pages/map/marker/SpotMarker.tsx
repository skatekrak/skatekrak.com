import classNames from 'classnames';
import React from 'react';

import { Marker, ViewportProps } from 'react-map-gl';

import { Spot } from 'lib/carrelageClient';
import IconDiy from 'components/pages/map/marker/icons/Diy';
import IconPark from 'components/pages/map/marker/icons/Park';
import IconPrivate from 'components/pages/map/marker/icons/Private';
import IconRip from 'components/pages/map/marker/icons/Rip';
import IconShop from 'components/pages/map/marker/icons/Shop';
import IconStreet from 'components/pages/map/marker/icons/Street';
import IconWip from 'components/pages/map/marker/icons/Wip';

import BadgeHistory from 'components/pages/map/marker/badges/History';
import BadgeIconic from 'components/pages/map/marker/badges/Iconic';
import BadgeMinute from 'components/pages/map/marker/badges/Minute';

import Activity from 'components/pages/map/marker/Activity';

type Props = {
    spot: Spot;
    viewport: Partial<ViewportProps>;
    onSpotMarkerClick: (spot: Spot) => void;
    isSelected: boolean;
};

type State = {
    active?: boolean;
    firing?: boolean;
};

class SpotMarker extends React.Component<Props, State> {
    public state: State = {
        active: false,
        firing: false,
    };

    public componentDidMount() {
        if (this.props.spot.mediasStat.all > 3) {
            this.setState({ active: true });
        }

        if (this.props.spot.mediasStat.all >= 10) {
            this.setState({ firing: true });
        }
    }

    public render() {
        const { spot, isSelected } = this.props;
        const { active, firing } = this.state;

        return (
            <Marker
                latitude={spot.location.latitude}
                longitude={spot.location.longitude}
                offsetLeft={-24}
                offsetTop={-24}
                className={classNames({
                    'map-marker-clicked': isSelected,
                    'map-marker-active': active && !firing,
                    'map-marker-firing': firing,
                })}
            >
                <button
                    className={classNames('map-marker', {
                        'map-marker-firing': firing,
                    })}
                    onClick={this.onMarkerClick}
                >
                    <div className="map-marker-icon">
                        {spot.status === 'rip' && <IconRip key={spot.id} />}
                        {spot.status === 'wip' && <IconWip key={spot.id} />}
                        {spot.status === 'active' && [
                            spot.type === 'street' && <IconStreet key={spot.id} />,
                            spot.type === 'park' && <IconPark key={spot.id} />,
                            spot.type === 'shop' && <IconShop key={spot.id} />,
                            spot.type === 'private' && <IconPrivate key={spot.id} />,
                            spot.type === 'diy' && <IconDiy key={spot.id} />,
                        ]}
                    </div>
                    {spot.tags.length !== 0 && (
                        <div className="map-marker-badges">
                            {spot.tags.map((tag) => (
                                <React.Fragment key={tag}>
                                    {tag === 'famous' && <BadgeIconic />}
                                    {tag === 'history' && <BadgeHistory />}
                                    {tag === 'minute' && <BadgeMinute />}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                    {active && <Activity firing={firing} />}
                </button>
            </Marker>
        );
    }

    private onMarkerClick = () => {
        this.props.onSpotMarkerClick(this.props.spot);
    };
}

export default SpotMarker;
