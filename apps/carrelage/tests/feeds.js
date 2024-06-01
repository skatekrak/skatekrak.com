import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Feeds API', () => {
    describe('GET /profiles/:profileId/feed', () => {
        it('should return profile feed', (done) => {
            request(app)
                .get(`/profiles/${config.user.id}/feed`)
                .set('Authorization', config.token)
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(7);

                    const clip = res.body[0];
                    expect(clip.id).to.be.equal(config.clip.id);

                    const mediaWithTrick = res.body[1];
                    expect(mediaWithTrick.id).to.be.equal(config.mediaTrickDone.id);

                    const media = res.body[2];
                    expect(media.id).to.be.equal(config.media.id);

                    const trickSwitch = res.body[3];
                    expect(trickSwitch.id).to.be.equal(config.trickDoneSwitch.id);

                    const trickOllie = res.body[4];
                    expect(trickOllie.id).to.be.equal(config.trickDone.id);

                    const spot2 = res.body[5];
                    expect(spot2.id).to.be.equal(config.spot2.id);

                    const spot = res.body[6];
                    expect(spot.id).to.be.equal(config.spot.id);

                    done();
                })
                .catch(done);
        });

        it('should return BAD_REQUEST', (done) => {
            request(app)
                .get(`/profiles/${config.user.id}/feed`)
                .set('Authorization', config.token)
                .query({ limit: -20 })
                .query({ newer: new Date().toISOString() })
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.BAD_REQUEST)
                .then(() => done())
                .catch(done);
        });
    });

    describe('GET /spots/:objectId/overview', () => {
        it('should return spot feed', (done) => {
            request(app)
                .get(`/spots/${config.spot.id}/overview`)
                .set('Authorization', config.token)
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('object');

                    const { spot } = res.body;
                    expect(spot).to.be.an('object');
                    expect(spot.id).to.be.equal(config.spot.id);

                    const { medias } = res.body;
                    expect(medias).to.be.an('array');
                    expect(medias).to.have.lengthOf(2);

                    const { skaters } = res.body;
                    expect(skaters).to.be.an('array');
                    expect(skaters).to.have.lengthOf(2);
                    expect(skaters).to.shallowDeepEqual([
                        { id: 'max_menace', count: 1 },
                        { id: 'jeanpierre', count: '1' },
                    ]);

                    const { clips } = res.body;
                    expect(clips).to.be.an('array');
                    expect(clips).to.have.lengthOf(1);

                    done();
                })
                .catch(done);
        });
    });

    describe('GET /feeds/direct', () => {
        it('should return spot feed', (done) => {
            request(app)
                .get('/feeds/direct')
                .set('Authorization', config.token)
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(2);

                    const contest = res.body[0];
                    expect(contest.id).to.be.equal(config.contest.id);

                    const session = res.body[1];
                    expect(session.id).to.be.equal(config.session.id);

                    done();
                })
                .catch(done);
        });
    });

    describe('GET /feeds/personal', () => {
        it('should return personal feed', (done) => {
            request(app)
                .get('/feeds/personal')
                .set('Authorization', config.token2)
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(8);

                    const clip = res.body[0];
                    expect(clip.id).to.be.equal(config.clip.id);

                    const mediaWithTrick = res.body[1];
                    expect(mediaWithTrick.id).to.be.equal(config.mediaTrickDone.id);

                    const videoMedia = res.body[2];
                    expect(videoMedia.id).to.be.equal(config.mediaVideo.id);

                    const media = res.body[3];
                    expect(media.id).to.be.equal(config.media.id);

                    const trickSwitch = res.body[4];
                    expect(trickSwitch.id).to.be.equal(config.trickDoneSwitch.id);

                    const trickOllie = res.body[5];
                    expect(trickOllie.id).to.be.equal(config.trickDone.id);

                    const spot2 = res.body[6];
                    expect(spot2.id).to.be.equal(config.spot2.id);

                    const spot = res.body[7];
                    expect(spot.id).to.be.equal(config.spot.id);

                    done();
                })
                .catch(done);
        });

        it('should return BAD_REQUEST', (done) => {
            request(app)
                .get('/feeds/personal')
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
