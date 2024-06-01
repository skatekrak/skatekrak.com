import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Tests follow', () => {
    describe('POST /profiles/:profileId/follow', () => {
        it('should follow the previously created user', (done) => {
            request(app)
                .post(`/profiles/${config.user2.id}/follow`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.user2.id);
                    expect(res.body.followers).to.shallowDeepEqual([{ id: config.user.id }]);
                    done();
                })
                .catch(done);
        });
    });

    describe('POST /profiles/:profileId/unfollow', () => {
        it('should unfollow the previously followed user', (done) => {
            request(app)
                .post(`/profiles/${config.user2.id}/unfollow`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.user2.id);
                    expect(res.body.followers).to.have.lengthOf(0);
                    done();
                })
                .catch(done);
        });
    });

    describe('POST /profiles/:profileId/follow', () => {
        it('should follow user from user2', (done) => {
            request(app)
                .post(`/profiles/${config.user.id}/follow`)
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });
});
