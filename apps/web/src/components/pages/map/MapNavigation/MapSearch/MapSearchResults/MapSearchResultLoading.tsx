import * as S from './MapSearchResults.styled';

const MapSearchResultLoading = () => {
    return (
        <S.MapSearchResultsLoading>
            <span className="skeleton-circle" />
            <div className="skeleton-container-start">
                <span className="skeleton-box" />
                <span className="skeleton-box" />
            </div>
            <div className="skeleton-container-end">
                <span className="skeleton-box" />
                <span className="skeleton-box" />
            </div>
        </S.MapSearchResultsLoading>
    );
};

export default MapSearchResultLoading;
