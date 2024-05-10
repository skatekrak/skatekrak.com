import httpStatus from 'http-status';
import request from 'supertest';
// import { expect } from "chai";
import app from '../app/server';
import config from './config';

describe('Delete Like', () => {
    describe('DELETE /medias/:mediaId/comments/:commentId/likes/:likeId', () => {
        it('should delete a like on a comment', (done) => {
            request(app)
                .delete(`/medias/${config.media.id}/comments/${config.comment.id}/likes/${config.likeOnComment.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe('DELETE /medias/:mediaId/likes/:likeId', () => {
        it('should delete a like on a media', (done) => {
            request(app)
                .delete(`/medias/${config.media.id}/likes/${config.likeOnMedia.id}`)
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe('DELETE /clips/:clipId/likes/:likeId', () => {
        it('should delete a like on a clip', (done) => {
            request(app)
                .delete(`/clips/${config.clip.id}/likes/${config.likeOnClip.id}`)
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });
});
