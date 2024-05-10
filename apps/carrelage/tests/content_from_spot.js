import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Contents from Spot API', () => {
    describe('GET /spots/:objectId/medias', () => {
        it('should return medias attached to the spot', (done) => {
            request(app)
                .get(`/spots/${config.spot.id}/medias`)
                .set('Authorization', config.token)
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(2);

                    const media = res.body[0];
                    expect(media.id).to.be.equal(config.mediaTrickDone.id);

                    done();
                })
                .catch(done);
        });

        it('should return BAD_REQUEST', (done) => {
            request(app)
                .get(`/spots/${config.spot.id}/medias`)
                .set('Authorization', config.token)
                .query({ limit: -20 })
                .query({ newer: new Date().toISOString() })
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.BAD_REQUEST)
                .then(() => done())
                .catch(done);
        });
    });

    describe('GET /spots/:objectId/sessions', () => {
        it('should return sessions attached to the spot', (done) => {
            request(app)
                .get(`/spots/${config.spot.id}/sessions`)
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
                .get(`/spots/${config.spot.id}/sessions`)
                .set('Authorization', config.token)
                .query({ limit: -20 })
                .query({ newer: new Date().toISOString() })
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.BAD_REQUEST)
                .then(() => done())
                .catch(done);
        });
    });

    describe('GET /spots/:objectId/clips', () => {
        it('should return clips attached to the spot', (done) => {
            request(app)
                .get(`/spots/${config.spot.id}/clips`)
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
                .get(`/spots/${config.spot.id}/clips`)
                .set('Authorization', config.token)
                .query({ limit: -20 })
                .query({ newer: new Date().toISOString() })
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.BAD_REQUEST)
                .then(() => done())
                .catch(done);
        });
    });

    describe('GET /spots/:objectId/tricks-done', () => {
        it('should return tricks done on spot', (done) => {
            request(app)
                .get(`/spots/${config.spot.id}/tricks-done`)
                .set('Authorization', config.token)
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(1);

                    const latestTrickDone = res.body[0];
                    expect(latestTrickDone.id).to.be.equal(config.trickDoneSwitch.id);

                    done();
                })
                .catch(done);
        });

        it('should return BAD_REQUEST', (done) => {
            request(app)
                .get(`/spots/${config.user.id}/tricks-done`)
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
