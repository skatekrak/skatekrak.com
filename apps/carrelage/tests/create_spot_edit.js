import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Create Spot Edits', () => {
    describe('GET /spots/:id/edits', () => {
        it('should be Unauthorized without auth provided', (done) => {
            request(app)
                .get(`/spots/${config.spot.id}/edits`)
                .expect(httpStatus.UNAUTHORIZED)
                .then(() => done())
                .catch(done);
        });

        it('should be empty for a new spot', (done) => {
            request(app)
                .get(`/spots/${config.spot.id}/edits`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { body } = res;
                    expect(body).to.have.lengthOf(0);
                    done();
                })
                .catch(done);
        });
    });

    describe('POST /spots/:id/edits', () => {
        it('should be Unauthorized without auth provided', (done) => {
            request(app)
                .post(`/spots/${config.spot.id}/edits`)
                .send(config.spotEditSmall)
                .expect(httpStatus.UNAUTHORIZED)
                .then(() => done())
                .catch(done);
        });

        it('should be a bad request without body args', (done) => {
            request(app)
                .post(`/spots/${config.spot.id}/edits`)
                .set('Authorization', config.token)
                .expect(httpStatus.BAD_REQUEST)
                .then(() => done())
                .catch(done);
        });

        it('should be a bad request if only longitude is provided', (done) => {
            request(app)
                .post(`/spots/${config.spot.id}/edits`)
                .send({
                    name: 'Test BS',
                    longitude: 4.04,
                })
                .set('Authorization', config.token)
                .expect(httpStatus.BAD_REQUEST)
                .then(() => done())
                .catch(done);
        });

        it('should create a new small spot edit', (done) => {
            request(app)
                .post(`/spots/${config.spot.id}/edits`)
                .send(config.spotEditSmall)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { body } = res;
                    const { spotEditSmall } = config;

                    expect(body.addedBy).to.equal(config.user.id);
                    expect(body.status).to.equal(spotEditSmall.status);

                    config.spotEditSmall = body;
                    done();
                })
                .catch(done);
        });

        it('should failed to create a new spot edit because already one for this user', (done) => {
            request(app)
                .post(`/spots/${config.spot.id}/edits`)
                .send(config.spotEditSmall)
                .set('Authorization', config.token)
                .expect(httpStatus.BAD_REQUEST)
                .then(() => done())
                .catch(done);
        });
    });

    describe('GET /spots/:id/edits', () => {
        it('should have a size of 1', (done) => {
            request(app)
                .get(`/spots/${config.spot.id}/edits`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { body } = res;
                    expect(body).to.have.lengthOf(1);
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /spots/:spotId/edits/:editId', () => {
        it('should be a bad request if editId does not match ObjectId pattern', (done) => {
            request(app)
                .get(`/spots/${config.spot.id}/edits/bs`)
                .set('Authorization', config.token)
                .expect(httpStatus.BAD_REQUEST)
                .then(() => done())
                .catch(done);
        });

        it('should be a not found if the spot edit does not exist', (done) => {
            request(app)
                .get(`/spots/${config.spot.id}/edits/5afa1b188255a600aec87643`)
                .set('Authorization', config.token)
                .expect(httpStatus.NOT_FOUND)
                .then(() => done())
                .catch(done);
        });

        it('should get the spotEditSmall', (done) => {
            request(app)
                .get(`/spots/${config.spot.id}/edits/${config.spotEditSmall.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { body } = res;
                    const { spotEditSmall } = config;

                    expect(body.addedBy).to.equal(config.user.id);
                    expect(body.status).to.equal(spotEditSmall.status);

                    done();
                })
                .catch(done);
        });
    });

    describe('PUT /spots/:spotId?editId=:editId', () => {
        it('should be Forbidden because you are not the spot creator', (done) => {
            request(app)
                .put(`/spots/${config.spot.id}`)
                .query({ editId: config.spotEditSmall.id })
                .set('Authorization', config.token2)
                .expect(httpStatus.FORBIDDEN)
                .then(() => done())
                .catch(done);
        });

        it('should be Not Found because the Spot Edit does not exist', (done) => {
            request(app)
                .put(`/spots/${config.spot.id}`)
                .query({ editId: '5afa5bf8dc9f4b00e6ba4e0f' })
                .set('Authorization', config.token)
                .expect(httpStatus.NOT_FOUND)
                .then(() => done())
                .catch(done);
        });

        it('should apply the Spot Edit on the Spot', (done) => {
            request(app)
                .put(`/spots/${config.spot.id}`)
                .query({ editId: config.spotEditSmall.id })
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { body } = res;
                    const { spotEditSmall } = config;
                    expect(body.status).to.equal(spotEditSmall.status);
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /spots/:id/edits', () => {
        it('should have a size of 0', (done) => {
            request(app)
                .get(`/spots/${config.spot.id}/edits`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { body } = res;
                    expect(body).to.have.lengthOf(0);
                    done();
                })
                .catch(done);
        });
    });
});
