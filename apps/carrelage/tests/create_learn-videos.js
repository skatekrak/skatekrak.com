import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Create Learn API', () => {
    describe('POST /tricks/:trickId/learn-videos', () => {
        it('should create a learn video', (done) => {
            request(app)
                .post(`/tricks/${config.trick.id}/learn-videos`)
                .send(config.learnVideo)
                .set('Authorization', config.tokenAdmin)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.className).to.equal('learn-video');
                    expect(res.body.videoURL).to.equal(config.learnVideo.url);
                    expect(res.body.title).to.equal('KrakBox unboxing - Best Of #4');
                    expect(res.body.thumbnailURL).to.equal('https://i.ytimg.com/vi/cdghhu3Yj8A/sddefault.jpg');
                    expect(res.body.provider).to.equal('youtube');
                    expect(res.body.trick).to.equal(config.trick.id);
                    config.learnVideo = res.body;
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /tricks/:trickId/learn-videos/:learnVideoId', () => {
        it('should get the previously created learn video', (done) => {
            request(app)
                .get(`/tricks/${config.trick.id}/learn-videos/${config.learnVideo.id}`)
                .set('Authorization', config.tokenAdmin)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.className).to.equal(config.learnVideo.className);
                    expect(res.body.videoURL).to.equal(config.learnVideo.videoURL);
                    expect(res.body.title).to.equal(config.learnVideo.title);
                    expect(res.body.thumbnailURL).to.equal(config.learnVideo.thumbnailURL);
                    expect(res.body.trick).to.equal(config.learnVideo.trick);
                    expect(res.body.provider).to.equal(config.learnVideo.provider);
                    done();
                })
                .catch(done);
        });
    });

    describe('PATCH /tricks/:trickId/learn-videos/:learnVideoId', () => {
        it('should update the learn video', (done) => {
            request(app)
                .patch(`/tricks/${config.trick.id}/learn-videos/${config.learnVideo.id}`)
                .set('Authorization', config.tokenAdmin)
                .send({ title: 'Best Learn Video ever' })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.learnVideo.id);
                    expect(res.body.title).to.equal('Best Learn Video ever');
                    done();
                })
                .catch(done);
        });
    });

    describe('POST /tricks/:trickId/learn-videos/:learnVideoId/likes', () => {
        it('should like the learn video', (done) => {
            request(app)
                .post(`/tricks/${config.trick.id}/learn-videos/${config.learnVideo.id}/likes`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.addedBy).to.equal(config.user.id);
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /tricks/:trickId/learn-videos', () => {
        it('should list all learn videos for a trick', (done) => {
            request(app)
                .get(`/tricks/${config.trick.id}/learn-videos`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(1);
                    done();
                })
                .catch(done);
        });
    });
});
