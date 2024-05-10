import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Gears API', () => {
    const gears = {
        wheels: 'Spitfire ABC 54mm',
    };

    describe('PUT /profiles/:userId', () => {
        it('should create a new gear', (done) => {
            request(app)
                .put(`/profiles/${config.user.id}`)
                .send({ gears })
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.user.id);
                    expect(res.body.gears.wheels).to.equal(gears.wheels);
                    done();
                })
                .catch(done);
        });

        it('should replace the wheels previously added', (done) => {
            request(app)
                .put(`/profiles/${config.user.id}`)
                .send({
                    gears: {
                        wheels: 'Random wheels model',
                    },
                })
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.user.id);
                    expect(res.body.gears.wheels).to.equal('Random wheels model');
                    gears.wheels = res.body.gears.wheels;
                    done();
                })
                .catch(done);
        });

        it('should throw an error as this type of gear is not supported', (done) => {
            request(app)
                .put(`/profiles/${config.user.id}`)
                .send({
                    gears: {
                        scooter: 'Bad stuff',
                    },
                })
                .set('Authorization', config.token)
                .expect(httpStatus.BAD_REQUEST)
                .then(() => done())
                .catch(done);
        });
    });

    describe('GET /profiles/:userId', () => {
        it('should get profiles with gear previously created', (done) => {
            request(app)
                .get(`/profiles/${config.user.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.gears).to.be.an('object');
                    expect(res.body.gears.wheels).to.equal(gears.wheels);
                    done();
                })
                .catch(done);
        });
    });

    describe('PUT /profiles/:userId', () => {
        it('should delete the gear', (done) => {
            request(app)
                .put(`/profiles/${config.user.id}`)
                .send({
                    gears: {
                        wheels: null,
                    },
                })
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.user.id);
                    expect(res.body.gears).to.not.have.property('wheels');
                    done();
                })
                .catch(done);
        });
    });
});
