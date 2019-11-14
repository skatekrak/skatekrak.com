/* tslint:disable:max-line-length */
export default ({ firing }) => (
    <svg
        className={`
            map-marker-activity
            ${firing && 'map-marker-activity-firing'}
        `}
        viewBox="0 0 48 48"
    >
        <circle className="map-marker-activity-inner" cx="24" cy="24" r="13" />
        <circle className="map-marker-activity-middle" cx="24" cy="24" r="18" />
        <circle className="map-marker-activity-outter" cx="24" cy="24" r="24" />
    </svg>
);
