import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Delete Spot Edits', () => {
    describe('Prepare context for spot edit deletion', () => {
        it('should create a new full spot edit', (done) => {
            request(app)
                .post(`/spots/${config.spot.id}/edits`)
                .send(config.spotEditFull)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { body } = res;
                    const { spotEditFull } = config;

                    expect(body.addedBy).to.equal(config.user.id);
                    expect(body.name).to.equal(spotEditFull.name);
                    expect(body.longitude).to.equal(spotEditFull.longitude);
                    expect(body.latitude).to.equal(spotEditFull.latitude);
                    expect(body.type).to.equal(spotEditFull.type);
                    expect(body.status).to.equal(spotEditFull.status);
                    expect(body.description).to.equal(spotEditFull.description);
                    expect(body.indoor).to.equal(spotEditFull.indoor);
                    expect(body.phone).to.equal(spotEditFull.phone);
                    expect(body.website).to.equal(spotEditFull.website);
                    expect(body.instagram).to.equal(spotEditFull.instagram);
                    expect(body.snapchat).to.equal(spotEditFull.snapchat);
                    expect(body.facebook).to.equal(spotEditFull.facebook);

                    config.spotEditFull = body;
                    done();
                })
                .catch(done);
        });

        it('should get the spotEditFull', (done) => {
            request(app)
                .get(`/spots/${config.spot.id}/edits/${config.spotEditFull.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { body } = res;
                    const { spotEditFull } = config;

                    expect(body.addedBy).to.equal(config.user.id);
                    expect(body.id).to.equal(spotEditFull.id);
                    expect(body.name).to.equal(spotEditFull.name);
                    expect(body.longitude).to.equal(spotEditFull.longitude);
                    expect(body.latitude).to.equal(spotEditFull.latitude);
                    expect(body.type).to.equal(spotEditFull.type);
                    expect(body.status).to.equal(spotEditFull.status);
                    expect(body.description).to.equal(spotEditFull.description);
                    expect(body.indoor).to.equal(spotEditFull.indoor);
                    expect(body.phone).to.equal(spotEditFull.phone);
                    expect(body.website).to.equal(spotEditFull.website);
                    expect(body.instagram).to.equal(spotEditFull.instagram);
                    expect(body.snapchat).to.equal(spotEditFull.snapchat);
                    expect(body.facebook).to.equal(spotEditFull.facebook);

                    done();
                })
                .catch(done);
        });

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

    describe('DELETE /spots/:spotId/edits/:editId', () => {
        it('should be Unauthorized without auth provided', (done) => {
            request(app)
                .delete(`/spots/${config.spot.id}/edits/${config.spotEditFull.id}`)
                .expect(httpStatus.UNAUTHORIZED)
                .then(() => done())
                .catch(done);
        });

        it('should be a bad request if editId does not match ObjectId pattern', (done) => {
            request(app)
                .delete(`/spots/${config.spot.id}/edits/bs`)
                .set('Authorization', config.token)
                .expect(httpStatus.BAD_REQUEST)
                .then(() => done())
                .catch(done);
        });

        it('should be a not found if the spot edit does not exist', (done) => {
            request(app)
                .delete(`/spots/${config.spot.id}/edits/5afa1b188255a600aec87643`)
                .set('Authorization', config.token)
                .expect(httpStatus.NOT_FOUND)
                .then(() => done())
                .catch(done);
        });

        it('should delete spotEditFull', (done) => {
            request(app)
                .delete(`/spots/${config.spot.id}/edits/${config.spotEditFull.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    const { body } = res;
                    const { spotEditFull } = config;
                    expect(body.id).to.equal(spotEditFull.id);
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
