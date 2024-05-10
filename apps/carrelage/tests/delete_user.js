import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Delete User/Profile', () => {
    describe('DELETE /users', () => {
        it('should delete user', (done) => {
            request(app)
                .delete(`/users/${config.user.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.user.id);
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /profiles/:profileId', () => {
        it('should report error NOT_FOUND as admin, when user has been deleted', (done) => {
            request(app)
                .get(`/profiles/${config.user.id}`)
                .set('Authorization', config.tokenAdmin)
                .expect(httpStatus.NOT_FOUND)
                .then(() => {
                    done();
                })
                .catch(done);
        });

        it('should report error UNAUTHORIZED, when user has been deleted, so the token as well', (done) => {
            request(app)
                .get(`/profiles/${config.user.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.UNAUTHORIZED)
                .then(() => {
                    done();
                })
                .catch(done);
        });

        it('should get second user with 0 followers', (done) => {
            request(app)
                .get(`/profiles/${config.user2.id}`)
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.followers).to.be.an('array');
                    expect(res.body.followers).to.have.lengthOf(0);
                    expect(res.body.following).to.be.an('array');
                    expect(res.body.following).to.have.lengthOf(0);
                    done();
                })
                .catch(done);
        });
    });

    describe('DELETE /users', () => {
        it('should delete the second user', (done) => {
            request(app)
                .delete(`/users/${config.user2.id}`)
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.user2.id);
                    done();
                })
                .catch(done);
        });
    });
});
