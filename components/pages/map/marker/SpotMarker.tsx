import classNames from 'classnames';
import React from 'react';

import { Cluster, Spot } from 'carrelage';
import { Marker } from 'react-map-gl';

import IconDiy from 'components/pages/map/marker/icons/Diy';
import IconPark from 'components/pages/map/marker/icons/Park';
import IconPrivate from 'components/pages/map/marker/icons/Private';
import IconShop from 'components/pages/map/marker/icons/Shop';
import IconStreet from 'components/pages/map/marker/icons/Street';

import BadgeIconic from 'components/pages/map/marker/badges/Iconic';

import Activity from 'components/pages/map/marker/Activity';

type Props = {
    spot: Spot;
    viewport: {
        latitude: number;
        longitude: number;
        zoom: number;
    };
    fitBounds: (b1: [number, number], b2: [number, number]) => void;
    onSpotMarkerClick: (spot: Spot) => void;
    spotMarkerClicked?: string;
};

type State = {
    firing?: boolean;
    isClicked: boolean;
};

class SpotMarker extends React.Component<Props, State> {
    public static getDerivedStateFromProps(nextProps: Readonly<Props>): State {
        return {
            isClicked: nextProps.spotMarkerClicked === nextProps.spot.id ? true : false,
        };
    }

    public state: State = {
        firing: false,
        isClicked: false,
    };

    public componentDidMount() {
        if (this.props.spot.mediasStat.all >= 10) {
            this.setState({ firing: true });
        }
    }

    public render() {
        const { spot } = this.props;
        const { firing, isClicked } = this.state;

        return (
            <Marker
                latitude={spot.location.latitude}
                longitude={spot.location.longitude}
                offsetLeft={-24}
                offsetTop={-24}
                className={classNames({ 'map-marker-clicked': isClicked })}
            >
                <button
                    className={classNames('map-marker', {
                        'map-marker-firing': firing,
                    })}
                    onClick={this.onMarkerClick}
                >
                    <div className="map-marker-icon">
                        {spot.type === 'street' && <IconStreet />}
                        {spot.type === 'park' && <IconPark />}
                        {spot.type === 'shop' && <IconShop />}
                        {spot.type === 'private' && <IconPrivate />}
                        {spot.type === 'diy' && <IconDiy />}
                    </div>
                    {spot.tags.length !== 0 && (
                        <div className="map-marker-badges">
                            {spot.tags.map((tag) => (
                                <BadgeIconic key={tag} />
                            ))}
                        </div>
                    )}
                    {spot.mediasStat.all > 1 && <Activity firing={firing} />}
                </button>
            </Marker>
        );
    }

    private onMarkerClick = () => {
        this.props.onSpotMarkerClick(this.props.spot);
    };
}

export default SpotMarker;
