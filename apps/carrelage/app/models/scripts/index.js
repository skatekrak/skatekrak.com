import addSpotsGeohash from './add-spots-geohash';
import updateSpotsGeohash from './update-spots-geohash';
import cleanBadMedias from './clean-bad-medias';
import cleanCloudinary from './clean-cloudinary';
import cleanMultipleInstallations from './clean-multiple-installations';
import computeProfilesSpotsStats from './compute-profiles-spots-stats';
import computeSpotsLocations from './compute-spots-locations';
import deleteExpiredTokens from './delete-expired-tokens';
import exportSpotsObstacles from './extract-spots-obstacles';
import createGeoLoc from './create-geo-loc';
// import generateSessionsCoverUrl from './generate-sessions-cover-url';
// import updateS3ToGcloud from './update-s3-to-gcloud';

export default {
    'add-spots-geohash': addSpotsGeohash,
    'update-spots-geohash': updateSpotsGeohash,
    'clean-bad-medias': cleanBadMedias,
    'clean-cloudinary': cleanCloudinary,
    'clean-multiple-installations': cleanMultipleInstallations,
    'compute-profiles-spots-stats': computeProfilesSpotsStats,
    'compute-spots-locations': computeSpotsLocations,
    'delete-expired-tokens': deleteExpiredTokens,
    'extract-spots-obstacles': exportSpotsObstacles,
    'create-geo-loc': createGeoLoc,
    // 'generate-sessions-cover-url': generateSessionsCoverUrl,
    // 'update-s3-to-gcloud': updateS3ToGcloud,
};
