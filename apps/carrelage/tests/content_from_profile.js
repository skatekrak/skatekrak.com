import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Contents from Profile API', () => {
    describe('GET /profiles/:profileId/medias', () => {
        it('should return image medias created by user', (done) => {
            request(app)
                .get(`/profiles/${config.user.id}/medias`)
                .set('Authorization', config.token)
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(2);

                    const mediaWithTrick = res.body[0];
                    expect(mediaWithTrick.id).to.be.equal(config.mediaTrickDone.id);

                    const media = res.body[1];
                    expect(media.id).to.be.equal(config.media.id);

                    done();
                })
                .catch(done);
        });

        it('should return BAD_REQUEST', (done) => {
            request(app)
                .get(`/profiles/${config.user.id}/medias`)
                .set('Authorization', config.token)
                .query({ limit: -20 })
                .query({ newer: new Date().toISOString() })
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.BAD_REQUEST)
                .then(() => done())
                .catch(done);
        });
    });

    describe('GET /profiles/:profileId/spots', () => {
        it('should return spots created by user', (done) => {
            request(app)
                .get(`/profiles/${config.user.id}/spots`)
                .set('Authorization', config.token)
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(2);

                    const spot = res.body[1];
                    expect(spot.id).to.be.equal(config.spot.id);

                    const spot2 = res.body[0];
                    expect(spot2.id).to.be.equal(config.spot2.id);

                    done();
                })
                .catch(done);
        });

        it('should return BAD_REQUEST', (done) => {
            request(app)
                .get(`/profiles/${config.user.id}/spots`)
                .set('Authorization', config.token)
                .query({ limit: -20 })
                .query({ newer: new Date().toISOString() })
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.BAD_REQUEST)
                .then(() => done())
                .catch(done);
        });
    });

    describe('GET /profiles/:profileId/sessions', () => {
        it('should return sessions created by user', (done) => {
            request(app)
                .get(`/profiles/${config.user.id}/sessions`)
                .set('Authorization', config.token)
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(1);

                    const session = res.body[0];
                    expect(session.id).to.be.equal(config.session.id);

                    done();
                })
                .catch(done);
        });

        it('should return BAD_REQUEST', (done) => {
            request(app)
                .get(`/profiles/${config.user.id}/sessions`)
                .set('Authorization', config.token)
                .query({ limit: -20 })
                .query({ newer: new Date().toISOString() })
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.BAD_REQUEST)
                .then(() => done())
                .catch(done);
        });
    });

    describe('GET /profiles/:profileId/clips', () => {
        it('should return clips created by user', (done) => {
            request(app)
                .get(`/profiles/${config.user.id}/clips`)
                .set('Authorization', config.token)
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(1);

                    const clip = res.body[0];
                    expect(clip.id).to.be.equal(config.clip.id);

                    done();
                })
                .catch(done);
        });

        it('should return BAD_REQUEST', (done) => {
            request(app)
                .get(`/profiles/${config.user.id}/clips`)
                .set('Authorization', config.token)
                .query({ limit: -20 })
                .query({ newer: new Date().toISOString() })
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.BAD_REQUEST)
                .then(() => done())
                .catch(done);
        });
    });

    describe('GET /profiles/:profileId/tricks-done', () => {
        it('should return tricks done created by user', (done) => {
            request(app)
                .get(`/profiles/${config.user.id}/tricks-done`)
                .set('Authorization', config.token)
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(2);

                    const latestTrickDone = res.body[0];
                    expect(latestTrickDone.id).to.be.equal(config.trickDoneSwitch.id);

                    done();
                })
                .catch(done);
        });

        it('should return BAD_REQUEST', (done) => {
            request(app)
                .get(`/profiles/${config.user.id}/tricks-done`)
                .set('Authorization', config.token)
                .query({ limit: -20 })
                .query({ newer: new Date().toISOString() })
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.BAD_REQUEST)
                .then(() => done())
                .catch(done);
        });
    });
});
