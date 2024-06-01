import mag from '../helpers/mag';
import videos from '../helpers/videos';
import Clip from '../models/clip';
import Media from '../models/media';
import Spot from '../models/spot';

async function overview(req, res, next) {
    const { limit } = req.query;
    try {
        const [mediasOfWeek, clipsOfWeek, spotsOfMonth, magFeed, youtubeFeed] = await Promise.all([
            Media.mostLiked(limit, 'weekly'),
            Clip.mostLiked(limit, 'weekly'),
            Spot.mostMediasUploaded(limit, 'monthly'),
            mag.getMagFeed(),
            videos.getKrakYTFeed(),
        ]);
        res.json({
            mediasOfWeek,
            clipsOfWeek,
            spotsOfMonth,
            magFeed,
            youtubeFeed,
        });
    } catch (err) {
        next(err);
    }
}

export default { overview };
