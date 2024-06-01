import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Create Spots', () => {
    describe('POST /spots', () => {
        it('should create a new spot', (done) => {
            request(app)
                .post('/spots')
                .send(config.spot)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.name).to.equal(config.spot.name);
                    expect(res.body.description).to.equal(config.spot.description);
                    expect(res.body.location).to.be.an('object');
                    expect(res.body.location.longitude).to.equal(config.spot.longitude);
                    expect(res.body.location.latitude).to.equal(config.spot.latitude);
                    expect(res.body.addedBy).to.equal(config.user.id);
                    expect(res.body.indoor).to.equal(config.spot.indoor);
                    config.spot = res.body;
                    done();
                })
                .catch(done);
        });
    });

    describe('POST /spots', () => {
        it('should create second spot', (done) => {
            request(app)
                .post('/spots')
                .send(config.spot2)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.name).to.equal(config.spot2.name);
                    expect(res.body.description).to.equal(config.spot2.description);
                    expect(res.body.location).to.be.an('object');
                    expect(res.body.location.longitude).to.equal(config.spot2.longitude);
                    expect(res.body.location.latitude).to.equal(config.spot2.latitude);
                    expect(res.body.addedBy).to.equal(config.user.id);
                    expect(res.body.indoor).to.equal(config.spot2.indoor);
                    config.spot2 = res.body;
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /spots/:spotId', () => {
        it('should get spot details', (done) => {
            request(app)
                .get(`/spots/${config.spot.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.name).to.equal(config.spot.name);
                    expect(res.body.description).to.equal(config.spot.description);
                    expect(res.body.location).to.be.an('object');
                    expect(res.body.location.longitude).to.equal(config.spot.location.longitude);
                    expect(res.body.location.latitude).to.equal(config.spot.location.latitude);
                    expect(res.body.addedBy.id).to.equal(config.user.id);
                    done();
                })
                .catch(done);
        });

        it('should report error BAD_REQUEST, when spotId is not ObjectID', (done) => {
            request(app)
                .get('/spots/cbidon')
                .set('Authorization', config.token)
                .expect(httpStatus.BAD_REQUEST)
                .then(() => {
                    done();
                })
                .catch(done);
        });

        it('should report error NOT_FOUND, when spot not exists', (done) => {
            request(app)
                .get('/spots/ffffffffffffffffffffffff')
                .set('Authorization', config.token)
                .expect(httpStatus.NOT_FOUND)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe('PUT /spots/:spotId', () => {
        it('should update spot details (not the position)', (done) => {
            request(app)
                .put(`/spots/${config.spot.id}`)
                .send({
                    name: 'Krak Sweet Office',
                    description: 'best description',
                })
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.spot.id);
                    expect(res.body.name).to.equal('Krak Sweet Office');
                    expect(res.body.description).to.equal('best description');
                    expect(res.body.location).to.be.an('object');
                    expect(res.body.location.longitude).to.equal(config.spot.location.longitude);
                    expect(res.body.location.latitude).to.equal(config.spot.location.latitude);
                    expect(res.body.location.streetName).to.equal(config.spot.location.streetName);
                    config.spot = res.body;
                    done();
                })
                .catch(done);
        });

        it('should update the location and position of the spot', (done) => {
            request(app)
                .put(`/spots/${config.spot.id}`)
                .send({ latitude: 52.335339, longitude: 16.875 })
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.location.longitude).to.equal(16.875);
                    expect(res.body.location.latitude).to.equal(52.335339);
                    expect(res.body.location.streetName).to.not.equal(config.spot.location.streetName);
                    expect(res.body.location.city).to.not.equal(config.spot.location.city);
                    expect(res.body.location.country).to.not.equal(config.spot.location.country);
                    done();
                })
                .catch(done);
        });
    });

    describe('POST /spots/:spotId/follow', () => {
        it('should follow a spot', (done) => {
            request(app)
                .post(`/spots/${config.spot.id}/follow`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.className).to.equal('profile');
                    expect(res.body.spotsFollowing).to.shallowDeepEqual([{ id: config.spot.id }]);
                    done();
                })
                .catch(done);
        });
    });

    describe('POST /spots/:spotId/unfollow', () => {
        it('should follow a spot', (done) => {
            request(app)
                .post(`/spots/${config.spot.id}/unfollow`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.className).to.equal('profile');
                    // follow only 1 spot
                    expect(res.body.spotsFollowing).to.have.lengthOf(1);
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /spots', () => {
        it('should get list of spots', (done) => {
            request(app)
                .get('/spots')
                .set('Authorization', config.token)
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.FORBIDDEN)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /spots', () => {
        it('should get list of spots', (done) => {
            request(app)
                .get('/spots')
                .set('Authorization', config.tokenAdmin)
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(2);
                    expect(res.body[0].id).to.equal(config.spot2.id);
                    expect(res.body[1].id).to.equal(config.spot.id);
                    done();
                })
                .catch(done);
        });
    });
});
