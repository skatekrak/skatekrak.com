const MapSearchResultLoading = () => {
    return (
        <div className="flex items-center px-4 py-[15px] pr-4 pl-3 [&_span]:block [&_span]:rounded-sm [&_span]:bg-onDark-placeholder [&>.skeleton-circle]:w-8 [&>.skeleton-circle]:h-8 [&>.skeleton-circle]:rounded-full [&>.skeleton-container-start]:grow [&>.skeleton-container-start]:ml-3 [&>.skeleton-container-start>.skeleton-box]:h-2.5 [&>.skeleton-container-start>.skeleton-box]:w-[65%] [&>.skeleton-container-start>.skeleton-box:first-child]:mb-2 [&>.skeleton-container-start>.skeleton-box:last-child]:w-[80%] [&>.skeleton-container-end]:ml-auto [&>.skeleton-container-end]:w-[20%] [&>.skeleton-container-end>.skeleton-box]:h-2.5 [&>.skeleton-container-end>.skeleton-box]:w-full [&>.skeleton-container-end>.skeleton-box:first-child]:mb-2">
            <span className="skeleton-circle" />
            <div className="skeleton-container-start">
                <span className="skeleton-box" />
                <span className="skeleton-box" />
            </div>
            <div className="skeleton-container-end">
                <span className="skeleton-box" />
                <span className="skeleton-box" />
            </div>
        </div>
    );
};

export default MapSearchResultLoading;
