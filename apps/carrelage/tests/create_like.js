import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Create Like on Media', () => {
    describe('POST /medias/:mediaId/likes', () => {
        it('should create a new like on a media', (done) => {
            request(app)
                .post(`/medias/${config.media.id}/likes/`)
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then((res) => {
                    config.likeOnMedia = res.body;
                    expect(res.body.addedBy).to.be.an('string');
                    expect(res.body.addedBy).to.be.equal(config.user2.id);
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /notifications', () => {
        it('should get a list of notification with the previous like', (done) => {
            request(app)
                .get('/notifications')
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    const lastNotification = res.body[0];
                    expect(lastNotification.type).to.be.equal('like');
                    expect(lastNotification.fromUser.id).to.be.equal(config.user2.id);
                    expect(lastNotification.toUser.id).to.be.equal(config.user.id);
                    expect(lastNotification.infos[0].className).to.be.equal('media');
                    expect(lastNotification.infos[1].className).to.be.equal('like');
                    done();
                })
                .catch(done);
        });
    });
});

describe("Create Like on Media's Comment", () => {
    describe('POST /medias/:mediaId/comments/:commentId/likes', () => {
        it('should create a new like on a comment', (done) => {
            request(app)
                .post(`/medias/${config.media.id}/comments/${config.comment.id}/likes`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    config.likeOnComment = res.body;
                    expect(res.body.addedBy).to.be.an('string');
                    expect(res.body.addedBy).to.be.equal(config.user.id);
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /notifications', () => {
        it('should get a list of notification with the previous like', (done) => {
            request(app)
                .get('/notifications')
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    const lastNotification = res.body[0];
                    expect(lastNotification.type).to.be.equal('like');
                    expect(lastNotification.fromUser.id).to.be.equal(config.user.id);
                    expect(lastNotification.toUser.id).to.be.equal(config.user2.id);
                    expect(lastNotification.infos[0].className).to.be.equal('media');
                    expect(lastNotification.infos[1].className).to.be.equal('comment');
                    expect(lastNotification.infos[2].className).to.be.equal('like');
                    done();
                })
                .catch(done);
        });
    });
});

describe('Create Like on Clip', () => {
    describe('POST /clips/:clipId/likes', () => {
        it('should create a new like on the clip', (done) => {
            request(app)
                .post(`/clips/${config.clip.id}/likes`)
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.addedBy).to.be.an('string');
                    expect(res.body.addedBy).to.equal(config.user2.id);
                    config.likeOnClip = res.body;
                    done();
                });
        });
    });

    describe('GET /notifications', () => {
        it('should get the list of notifications with the previous like on top', (done) => {
            request(app)
                .get('/notifications')
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    const lastNotification = res.body[0];
                    expect(lastNotification.type).to.be.equal('like');
                    expect(lastNotification.toUser.id).to.be.equal(config.user.id);
                    expect(lastNotification.infos[0].className).to.be.equal('clip');
                    expect(lastNotification.infos[1].className).to.be.equal('like');
                    done();
                })
                .catch(done);
        });
    });
});
