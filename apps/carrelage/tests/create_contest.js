import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Contests API', () => {
    describe('POST /contests', () => {
        it('should create a new contest', (done) => {
            request(app)
                .post('/contests')
                .send(config.contest)
                .set('Authorization', config.tokenAdmin)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.title).to.equal(config.contest.title);
                    expect(res.body.description).to.equal(config.contest.description);
                    expect(res.body.reward).to.equal(config.contest.reward);
                    config.contest = res.body;
                    done();
                })
                .catch(done);
        });
    });

    describe('PUT /contests/:objectId/upload', () => {
        it('should upload a logo to the spot', (done) => {
            request(app)
                .put(`/contests/${config.contest.id}/upload`)
                .attach('file', './tests/files/pic.jpg')
                .set('Authorization', config.tokenAdmin)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.contest.id);
                    expect(res.body.logoURL).to.be.a('string');
                    config.contest = res.body;
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /contests/:objectId', () => {
        it('should get the previously created contest', (done) => {
            request(app)
                .get(`/contests/${config.contest.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.contest.id);
                    expect(res.body.title).to.equal(config.contest.title);
                    expect(res.body.description).to.equal(config.contest.description);
                    expect(res.body.reward).to.equal(config.contest.reward);
                    expect(res.body.logoURL).to.equal(config.contest.logoURL);
                    done();
                })
                .catch(done);
        });
    });

    describe('PATCH /contests/:objectId', () => {
        it('should update the existing contest', (done) => {
            request(app)
                .patch(`/contests/${config.contest.id}`)
                .send({
                    title: '#yeahgirlcontest',
                    description: 'lol this is a description',
                    reward: 'nice reward mate',
                })
                .set('Authorization', config.tokenAdmin)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.title).to.equal('#yeahgirlcontest');
                    expect(res.body.description).to.equal('lol this is a description');
                    expect(res.body.reward).to.equal('nice reward mate');
                    config.contest = res.body;
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /contests', () => {
        it('should get a list of contests', (done) => {
            request(app)
                .get('/contests')
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(1);
                    const firstContest = res.body[0];
                    expect(firstContest.title).to.equal(config.contest.title);
                    expect(firstContest.id).to.equal(config.contest.id);
                    expect(firstContest.reward).to.equal(config.contest.reward);
                    done();
                })
                .catch(done);
        });
    });
});
