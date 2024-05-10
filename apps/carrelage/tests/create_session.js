import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Create Session', () => {
    describe('POST /sessions', () => {
        it('should create a session with a spot', (done) => {
            const { session } = config;
            session.spots = [config.spot.id];
            session.with = [config.user2.id];
            request(app)
                .post('/sessions')
                .send(session)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.className).to.equal('session');
                    expect(res.body.addedBy).to.equal(config.user.id);
                    expect(res.body.caption).to.equal(session.caption);
                    expect(res.body.coverURL).to.be.an('string');
                    expect(res.body.with).to.be.an('array');
                    expect(res.body.with).to.have.lengthOf(1);
                    expect(res.body.spots).to.be.an('array');
                    expect(res.body.spots).to.have.lengthOf(1);
                    config.session = res.body;
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /sessions/:sessionId', () => {
        it('should get the previously created session', (done) => {
            const { session } = config;
            request(app)
                .get(`/sessions/${session.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.className).to.equal(session.className);
                    expect(res.body.caption).to.equal(session.caption);
                    expect(res.body.addedBy.id).to.equal(config.user.id);
                    expect(res.body.coverURL).to.be.an('string');
                    expect(res.body.with).to.be.an('array');
                    expect(res.body.with).to.have.lengthOf(1);
                    expect(res.body.with[0].id).to.equal(config.user2.id);
                    expect(res.body.spots).to.be.an('array');
                    expect(res.body.spots).to.have.lengthOf(1);
                    expect(res.body.spots[0].id).to.equal(config.spot.id);
                    expect(res.body.spots[0].name).to.equal(config.spot.name);
                    expect(res.body.spots[0].type).to.equal(config.spot.type);
                    done();
                })
                .catch(done);
        });
    });

    describe('PATCH /sessions/:sessionId', () => {
        it('should update the session', (done) => {
            const { session } = config;
            session.spots.push(config.spot2.id);
            request(app)
                .patch(`/sessions/${session.id}`)
                .set('Authorization', config.token)
                .send({
                    caption: 'Hello motherfucker',
                    spots: session.spots,
                })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.caption).to.equal('Hello motherfucker');
                    expect(res.body.spots).to.be.an('array');
                    expect(res.body.spots).to.have.lengthOf(2);
                    config.session = res.body;
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /sessions', () => {
        it("should get the session's list", (done) => {
            request(app)
                .get('/sessions')
                .set('Authorization', config.token)
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.FORBIDDEN)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /sessions', () => {
        it("should get the session's list", (done) => {
            const { session } = config;
            request(app)
                .get('/sessions')
                .set('Authorization', config.tokenAdmin)
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(1);
                    const lastSession = res.body[0];
                    expect(lastSession.id).to.equal(session.id);
                    expect(lastSession.className).to.equal(session.className);
                    expect(lastSession.addedBy.id).to.equal(config.user.id);
                    expect(lastSession.caption).to.equal(session.caption);
                    expect(lastSession.coverURL).to.be.an('string');

                    expect(lastSession.with).to.be.an('array');
                    expect(lastSession.with).to.have.lengthOf(1);
                    expect(lastSession.with[0].id).to.equal(config.user2.id);

                    expect(lastSession.spots).to.be.an('array');
                    expect(lastSession.spots).to.have.lengthOf(2);
                    expect(lastSession.spots[0].id).to.equal(config.spot.id);
                    expect(lastSession.spots[0].name).to.equal(config.spot.name);
                    expect(lastSession.spots[0].type).to.equal(config.spot.type);
                    expect(lastSession.spots[1].id).to.equal(config.spot2.id);
                    expect(lastSession.spots[1].name).to.equal(config.spot2.name);
                    expect(lastSession.spots[1].type).to.equal(config.spot2.type);
                    done();
                })
                .catch(done);
        });
    });
});
