import LearnVideo from '../models/learn-video';
import videoHelper from '../helpers/videos';

/**
 * Load LearnVideo and append to req
 */
function load(req, res, next) {
    LearnVideo.get(req.params.objectId)
        .then((video) => {
            req.object.push(video);
            return next();
        })
        .catch((e) => next(e));
}

/**
 * Get Learn LearnVideo
 * @return {LearnVideo}
 */
function get(req, res) {
    return res.json(req.object.last().el());
}

/**
 * Create a new learn video
 * @property {string} req.body.url - Url of the video
 * @property {string} req.body.trick - Trick to attach the video
 * @return {LearnVideo}
 */
async function create(req, res, next) {
    const learnVideo = new LearnVideo({
        videoURL: req.body.url,
        trick: req.object.first().el().id,
    });
    try {
        const info = await videoHelper.getVideoInformation(learnVideo.videoURL);
        learnVideo.title = info.title;
        learnVideo.description = info.description;
        learnVideo.thumbnailURL = info.thumbnailURL;
        learnVideo.provider = info.provider;
        const saved = await learnVideo.save();
        res.json(saved);
    } catch (err) {
        next(err);
    }
}

/**
 * Update an existing Learn Video
 * @property {string} req.body.title - Title of the video
 * @property {string} req.body.description - Description of the video
 * @property {string} req.body.trick - The trick of the Learn Video
 * @property {string} req.body.thumbnailURL - URL of the nex thumbnail
 * @return {LearnVideo}
 */
function update(req, res, next) {
    const learnVideo = req.object.last().el();

    if (req.body.title) {
        learnVideo.title = req.body.title;
    }

    if (req.body.description) {
        learnVideo.description = req.body.description;
    }

    if (req.body.trick) {
        learnVideo.tick = req.body.trick;
    }

    if (req.body.thumbnailURL) {
        learnVideo.thumbnailURL = req.body.thumbnailURL;
    }

    learnVideo
        .save()
        .then((savedLearnVideo) => res.json(savedLearnVideo))
        .catch((e) => next(e));
}

/**
 * List Learn Video
 * @property {number} skip - Number of learn video to be returned
 * @property {number} limit - Limit of Learn Videos to be returned
 * @returns {LearnVideo[]}
 */
function list(req, res, next) {
    const { limit = 20, skip = 0 } = req.query;
    const trick = req.object.first().el().id;
    LearnVideo.list({ skip, limit, trick })
        .then((learnVideos) =>
            learnVideos.map((videoRes) => {
                const video = videoRes;
                if (video.likes.length > 0) {
                    video.likes = video.likes.filter((like) => like.addedBy.id === req.user.id);
                }
                return video;
            }),
        )
        .then((videos) => res.json(videos))
        .catch((e) => next(e));
}

/**
 * Delete Learn Video
 * @return {LearnVideo}
 */
function remove(req, res, next) {
    const learnVideo = req.object.last().el();
    learnVideo
        .remove()
        .then((deletedVideo) => res.json(deletedVideo))
        .catch((e) => next(e));
}

export default {
    load,
    get,
    create,
    update,
    list,
    remove,
};
