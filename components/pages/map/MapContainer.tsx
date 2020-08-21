import classNames from 'classnames';
import React from 'react';
import { InteractiveMap, FlyToInterpolator, ViewportProps } from 'react-map-gl';
import { connect } from 'react-redux';
import { getDistanceScales } from 'viewport-mercator-project';

import Typings from 'Types';

import { Cluster, Spot, Status, SpotOverview } from 'lib/carrelageClient';

import Legend from 'components/pages/map/Legend';
import BannerTop from 'components/Ui/Banners/BannerTop';
import { boxSpotsSearch, getSpotOverview } from 'lib/carrelageClient';
import { MapState } from 'store/map/reducers';
import { selectAllMapFilters, mapRefreshEnd, setViewport } from 'store/map/actions';
import { FilterStateUtil } from 'lib/FilterState';
import MapCustomNavigationTrail from './MapCustom/MapCustomNavigationTrail/MapCustomNavigationTrail';
import MapCustomNavigation from './MapCustom/MapCustomNavigation';
import MapComponent from './MapComponent';
import MapGradients from './MapGradients';

type Props = {
    isMobile: boolean;
    map: MapState;

    selectAllMapFilters: () => void;
    mapRefreshEnd: () => void;
    setViewport: (viewport: Partial<ViewportProps>) => void;
};

type State = {
    pixelsPerDegree: [number, number, number];
    clusters: Cluster[];
    clusterMaxSpots: number;
    selectedSpotOverview?: SpotOverview;
};

class MapContainer extends React.Component<Props, State> {
    public state: State = {
        pixelsPerDegree: [0, 0, 0],
        clusters: [],
        clusterMaxSpots: 1,
        selectedSpotOverview: undefined,
    };

    private mapRef = React.createRef<InteractiveMap>();
    private loadTimeout: NodeJS.Timeout;

    public componentDidMount() {
        this.load();
    }

    public componentDidUpdate(prevProps: Props) {
        if (prevProps.map.status !== this.props.map.status || prevProps.map.types !== this.props.map.types) {
            this.load();
        }

        if (prevProps.map.selectedSpot?.id !== this.props.map.selectedSpot?.id && this.props.map.selectedSpot) {
            this.flyTo(this.props.map.selectedSpot);
            this.onSpotMarkerClick(this.props.map.selectedSpot);
        }
    }

    public render() {
        const { selectedSpotOverview } = this.state;
        const { isMobile } = this.props;

        return (
            <div
                id="map-container"
                className={classNames({
                    'map-mobile': isMobile,
                })}
            >
                {isMobile ? (
                    <div id="map-mobile-message">
                        If you wanna enjoy our skatespots map and you're currently on your mobile, best way is to{' '}
                        <a href="/app" id="map-mobile-message-link">
                            download the app
                        </a>
                    </div>
                ) : (
                    <>
                        <BannerTop
                            offsetScroll={false}
                            link="/app"
                            text="The world is our playground. Download the app & help us enrich this map."
                        />
                        {/* <MapNavigation /> */}
                        <MapCustomNavigation />
                        <MapCustomNavigationTrail />
                        <Legend />
                        <MapComponent
                            mapRef={this.mapRef}
                            clusters={this.state.clusters}
                            selectedSpotOverview={selectedSpotOverview}
                            onSpotMarkerClick={this.onSpotMarkerClick}
                            onViewportChange={this.onViewportChange}
                            onPopupClose={this.onPopupClose}
                        />
                        <MapGradients />
                    </>
                )}
            </div>
        );
    }

    private load() {
        clearTimeout(this.loadTimeout);

        this.loadTimeout = setTimeout(async () => {
            if (this.mapRef.current) {
                const map = this.mapRef.current.getMap();
                const bounds = map.getBounds();
                const northEast = bounds.getNorthEast();
                const southWest = bounds.getSouthWest();

                let clusters = await boxSpotsSearch({
                    clustering: true,
                    northEastLatitude: northEast.lat,
                    northEastLongitude: northEast.lng,
                    southWestLatitude: southWest.lat,
                    southWestLongitude: southWest.lng,
                });

                this.refreshMap(clusters);
            }
        }, 200);
    }

    private onViewportChange = (viewport: { latitude: number; longitude: number; zoom: number }) => {
        this.props.setViewport(viewport);
        this.setState({
            pixelsPerDegree: getDistanceScales(viewport).pixelsPerDegree,
        });
        this.load();
    };

    private onPopupClose = () => {
        this.setState({
            selectedSpotOverview: undefined,
        });
    };

    private onSpotMarkerClick = async (spot: Spot) => {
        try {
            // const res = await axios.get(`${process.env.NEXT_PUBLIC_CARRELAGE_URL}/spots/${spot.id}/overview`);
            const spotOverview = await getSpotOverview(spot.id);
            this.setState({ selectedSpotOverview: spotOverview });
        } catch (err) {
            // console.log(err);
        }
    };

    private flyTo(spot: Spot) {
        const viewport: Partial<ViewportProps> = {
            ...this.props.map.viewport,
            latitude: spot.location.latitude,
            longitude: spot.location.longitude,
            transitionDuration: 1000,
            transitionInterpolator: new FlyToInterpolator(),
        };

        this.props.setViewport(viewport);
    }

    private refreshMap = (_clusters: Cluster[] | undefined = undefined) => {
        const clusters = this.filterClusters(_clusters ?? this.state.clusters);

        this.props.mapRefreshEnd();

        let clusterMaxSpots = 1;
        for (const cluster of clusters) {
            if (clusterMaxSpots < cluster.count) {
                clusterMaxSpots = cluster.count;
            }
        }
        this.setState({ clusters, clusterMaxSpots });
    };

    private filterClusters = (clusters: Cluster[]): Cluster[] => {
        let type = FilterStateUtil.getSelected(this.props.map.types);
        let status = FilterStateUtil.getSelected(this.props.map.status);

        return clusters
            .map((cluster) => {
                return {
                    ...cluster,
                    spots: cluster.spots.filter((spot) => {
                        if (spot.status === Status.Active) {
                            return type.indexOf(spot.type) !== -1;
                        } else {
                            return status.indexOf(spot.status) !== -1;
                        }
                    }),
                };
            })
            .filter((cluster) => cluster.spots.length > 0);
    };
}

const mapStateProps = ({ settings, map }: Typings.RootState) => ({
    isMobile: settings.isMobile,
    map,
});

export default connect(mapStateProps, { selectAllMapFilters, mapRefreshEnd, setViewport })(MapContainer);
