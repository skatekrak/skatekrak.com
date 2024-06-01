import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Create Media', () => {
    describe('POST /medias', () => {
        it('should create media', (done) => {
            config.media.spot = config.spot.id;
            request(app)
                .post('/medias')
                .send(config.media)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.caption).to.be.equal(config.media.caption);
                    expect(res.body.staffPicked).to.be.equal(false);

                    expect(res.body.spot).to.be.equal(config.spot.id);
                    expect(res.body.addedBy).to.be.equal(config.user.id);

                    expect(res.body.likes).to.be.an('array');
                    expect(res.body.likes).to.have.lengthOf(0);

                    expect(res.body.usertags).to.be.an('array');
                    expect(res.body.usertags).to.have.lengthOf(1);
                    expect(res.body.usertags).to.contains('jeanpierre');

                    expect(res.body.hashtags).to.be.an('array');
                    expect(res.body.hashtags).to.have.lengthOf(2);
                    expect(res.body.hashtags).to.contains('#krak');
                    expect(res.body.hashtags).to.contains('#1990');

                    config.media = res.body;
                    done();
                })
                .catch(done);
        });

        it('should create a media with an empty caption', (done) => {
            request(app)
                .post('/medias')
                .send({})
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.be.a('string');
                    expect(res.body.caption).to.be.an('undefined');
                    expect(res.body.hashtags).to.be.an('array');
                    expect(res.body.hashtags).to.have.lengthOf(0);
                    done();
                })
                .catch(done);
        });

        it('should create video media', (done) => {
            config.mediaVideo.spot = config.spot2.id;
            request(app)
                .post('/medias')
                .send(config.mediaVideo)
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then((res) => {
                    config.mediaVideo = res.body;
                    done();
                })
                .catch(done);
        });

        it('should create media with a trick done', (done) => {
            config.mediaTrickDone.spot = config.spot.id;
            request(app)
                .post('/medias')
                .send(config.mediaTrickDone)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.caption).to.equal(config.mediaTrickDone.caption);
                    expect(res.body.trickDone.trick).to.equal(config.mediaTrickDone.trickDone.trick);
                    expect(res.body.trickDone.points).to.equal(config.trick.points);
                    expect(res.body.trickDone.stanceBonus).to.equal(1);
                    expect(res.body.trickDone.totalPoints).to.equal(config.trick.points * 1);
                    expect(res.body.trickDone.validated).to.equal(true);
                    config.mediaTrickDone = res.body;
                    done();
                })
                .catch(done);
        });
    });

    describe('PATCH /medias/:mediaId', () => {
        it('should update media', (done) => {
            request(app)
                .patch(`/medias/${config.media.id}`)
                .send({
                    caption: 'This is an updated caption @max_menace #krak',
                })
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.caption).to.be.equal('This is an updated caption @max_menace #krak');

                    expect(res.body.usertags).to.be.an('array');
                    expect(res.body.usertags).to.have.lengthOf(1);
                    expect(res.body.usertags).to.contains('max_menace');

                    expect(res.body.hashtags).to.be.an('array');
                    expect(res.body.hashtags).to.have.lengthOf(1);
                    expect(res.body.hashtags).to.contains('#krak');

                    config.media = res.body;
                    done();
                })
                .catch(done);
        });
    });

    describe('PUT /medias/:mediaId/upload', () => {
        it('should upload media picture', (done) => {
            request(app)
                .put(`/medias/${config.media.id}/upload`)
                .attach('file', './tests/files/media.jpg')
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.be.equal(config.media.id);
                    expect(res.body.type).to.be.equal('image');

                    expect(res.body.image).to.be.an('object');
                    expect(res.body.image.url).to.be.an('string');
                    expect(res.body.image.publicId).to.be.an('string');

                    config.media = res.body;
                    done();
                })
                .catch(done);
        });

        it('should return BAD_REQUEST because already uploaded', (done) => {
            request(app)
                .put(`/medias/${config.media.id}/upload`)
                .attach('file', './tests/files/media.jpg')
                .set('Authorization', config.token)
                .expect(httpStatus.BAD_REQUEST)
                .then(() => done())
                .catch(done);
        });

        it('should upload media video', (done) => {
            request(app)
                .put(`/medias/${config.mediaVideo.id}/upload`)
                .attach('file', './tests/files/video.m4v')
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.be.equal(config.mediaVideo.id);
                    expect(res.body.type).to.be.equal('video');

                    expect(res.body.video).to.be.an('object');
                    expect(res.body.video.url).to.be.an('string');
                    expect(res.body.video.publicId).to.be.an('string');
                    expect(res.body.image.publicId).to.be.an('string');
                    expect(res.body.video.publicId).to.be.equal(res.body.image.publicId);

                    config.mediaVideo = res.body;
                    done();
                })
                .catch(done);
        });

        it('should return BAD_REQUEST because already uploaded', (done) => {
            request(app)
                .put(`/medias/${config.mediaVideo.id}/upload`)
                .attach('file', './tests/files/video.m4v')
                .set('Authorization', config.token2)
                .expect(httpStatus.BAD_REQUEST)
                .then(() => done())
                .catch(done);
        });

        it('should upload media picture on trickDone media', (done) => {
            request(app)
                .put(`/medias/${config.mediaTrickDone.id}/upload`)
                .attach('file', './tests/files/media.jpg')
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.be.equal(config.mediaTrickDone.id);
                    expect(res.body.type).to.be.equal('image');
                    expect(res.body.image).to.be.an('object');
                    expect(res.body.image.url).to.be.an('string');
                    expect(res.body.image.publicId).to.be.an('string');
                    config.mediaTrickDone = res.body;
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /medias/:mediaId', () => {
        it('should get media details', (done) => {
            request(app)
                .get(`/medias/${config.media.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.media.id);
                    expect(res.body.caption).to.be.equal(config.media.caption);
                    expect(res.body.staffPicked).to.be.equal(config.media.staffPicked);

                    expect(res.body.spot).to.be.an('object');
                    expect(res.body.spot.id).to.be.equal(config.spot.id);

                    expect(res.body.addedBy).to.be.an('object');
                    expect(res.body.addedBy.id).to.be.equal(config.user.id);

                    expect(res.body.likes).to.be.an('array');
                    expect(res.body.likes).to.have.lengthOf(0);

                    expect(res.body.usertags).to.be.an('array');
                    expect(res.body.usertags).to.have.lengthOf(1);
                    expect(res.body.usertags).to.contains('max_menace');

                    expect(res.body.hashtags).to.be.an('array');
                    expect(res.body.hashtags).to.have.lengthOf(1);
                    expect(res.body.hashtags).to.contains('#krak');

                    expect(res.body.type).to.be.equal('image');

                    expect(res.body.image).to.be.an('object');
                    expect(res.body.image.url).to.be.an('string');
                    expect(res.body.image.publicId).to.be.an('string');

                    done();
                })
                .catch(done);
        });
    });

    describe('GET /medias', () => {
        it('should return medias list', (done) => {
            request(app)
                .get('/medias')
                .set('Authorization', config.tokenAdmin)
                .query({ older: new Date().toISOString(), hashtag: '#krak' })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(2);

                    expect(res.body[0].id).to.equal(config.mediaVideo.id);
                    expect(res.body[1].id).to.equal(config.media.id);

                    done();
                })
                .catch(done);
        });
    });
});
