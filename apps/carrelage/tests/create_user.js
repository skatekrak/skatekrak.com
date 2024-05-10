import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Create User/Profile', () => {
    const profile = {};

    describe('POST /auth/signup to signup new user', () => {
        it('should created a new user', (done) => {
            request(app)
                .post('/auth/signup')
                .send(config.user)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.message).to.equal('authenticated');
                    expect(res.body.token).to.be.an('string');
                    expect(res.body.user.id).to.equal(config.user.username);
                    expect(res.body.user.email).to.equal(config.user.email);
                    expect(res.body.user.role).to.equal('user');
                    expect(res.body.user.createdAt).to.be.an('string');
                    expect(res.body.user.updatedAt).to.be.an('string');
                    expect(res.body.user.welcomeMailSent).to.equal(false);
                    expect(res.body.user.emailVerified).to.equal(false);
                    config.user = res.body.user;
                    profile.id = res.body.user.id;
                    done();
                })
                .catch(done);
        });

        it('should create a second user', (done) => {
            request(app)
                .post('/auth/signup')
                .send(config.user2)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.message).to.equal('authenticated');
                    expect(res.body.token).to.be.an('string');
                    expect(res.body.user.id).to.equal(config.user2.username);
                    expect(res.body.user.email).to.equal(config.user2.email);
                    expect(res.body.user.role).to.equal('user');
                    expect(res.body.user.createdAt).to.be.an('string');
                    expect(res.body.user.updatedAt).to.be.an('string');
                    expect(res.body.user.welcomeMailSent).to.equal(false);
                    expect(res.body.user.emailVerified).to.equal(false);
                    config.user2 = res.body.user;
                    done();
                })
                .catch(done);
        });

        it('should report BAD_REQUEST because of too short password < 6 characters', (done) => {
            request(app)
                .post('/auth/signup')
                .send({
                    username: 'max_menace',
                    password: 'shrt',
                    email: 'm@skatekrak.com',
                })
                .expect(httpStatus.BAD_REQUEST)
                .then((res) => {
                    expect(res.body.type).to.equal('APIError');
                    done();
                })
                .catch(done);
        });

        it('should report UNAUTHORIZED because username already taken', (done) => {
            request(app)
                .post('/auth/signup')
                .send({
                    username: 'max_menace',
                    password: 'chezcattet_m',
                    email: 'm@skatekrak.com',
                })
                .expect(httpStatus.UNAUTHORIZED)
                .then((res) => {
                    expect(res.body.type).to.equal('APIError');
                    done();
                })
                .catch(done);
        });

        it('should report UNAUTHORIZED because email already taken', (done) => {
            request(app)
                .post('/auth/signup')
                .send({
                    username: 'test',
                    password: 'chezcattet_m',
                    email: 'm@skatekrak.com',
                })
                .expect(httpStatus.UNAUTHORIZED)
                .then((res) => {
                    expect(res.body.type).to.equal('APIError');
                    done();
                })
                .catch(done);
        });
    });

    describe('POST /auth/login to login', () => {
        it('should log user', (done) => {
            request(app)
                .post('/auth/login')
                .send({
                    username: 'max_menace',
                    password: 'chezcattet_m',
                })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.message).to.equal('authenticated');
                    expect(res.body.token).to.be.an('string');
                    expect(res.body.user.id).to.equal(config.user.username);
                    expect(res.body.user.email).to.equal(config.user.email);
                    expect(res.body.user.role).to.equal('user');
                    expect(res.body.user.createdAt).to.be.an('string');
                    expect(res.body.user.updatedAt).to.be.an('string');
                    config.token = res.body.token;
                    done();
                })
                .catch(done);
        });

        it('should log the second user', (done) => {
            request(app)
                .post('/auth/login')
                .send({
                    username: 'jeanpierre',
                    password: 'chezcattet_m',
                })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.message).to.equal('authenticated');
                    expect(res.body.token).to.be.an('string');
                    expect(res.body.user.id).to.equal(config.user2.username);
                    expect(res.body.user.email).to.equal(config.user2.email);
                    expect(res.body.user.role).to.equal('user');
                    expect(res.body.user.createdAt).to.be.an('string');
                    expect(res.body.user.updatedAt).to.be.an('string');
                    config.token2 = res.body.token;
                    done();
                })
                .catch(done);
        });

        it('should log the root', (done) => {
            request(app)
                .post('/auth/login')
                .send({
                    username: 'root',
                    password: 'root',
                })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.message).to.equal('authenticated');
                    expect(res.body.token).to.be.an('string');
                    config.tokenAdmin = res.body.token;
                    done();
                })
                .catch(done);
        });

        it('should report UNAUTHORIZED because of wrong password', (done) => {
            request(app)
                .post('/auth/login')
                .send({
                    username: 'jeanpierre',
                    password: 'bulllshit',
                })
                .expect(httpStatus.UNAUTHORIZED)
                .then(() => done())
                .catch(done);
        });
    });

    describe('GET /users/:userId w/ bad token', () => {
        it('should report error Unauthorized because token does not exist', (done) => {
            request(app)
                .get(`/users/${config.user.id}`)
                .set('Authorization', config.tokenUserNotExist)
                .expect(httpStatus.UNAUTHORIZED)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /users/:userId', () => {
        it('should get user details', (done) => {
            request(app)
                .get(`/users/${config.user.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.user.id);
                    expect(res.body.email).to.equal(config.user.email);
                    expect(res.body.createdAt).to.be.an('string');
                    expect(res.body.updatedAt).to.be.an('string');
                    done();
                })
                .catch(done);
        });

        it('should report error NOT_FOUND, when user does not exists', (done) => {
            request(app)
                .get('/users/toitexistepas')
                .set('Authorization', config.token)
                .expect(httpStatus.NOT_FOUND)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /profiles', () => {
        it('should be FORBIDDEN', (done) => {
            request(app)
                .get('/profiles')
                .set('Authorization', config.token)
                .expect(httpStatus.FORBIDDEN)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /profiles/:profileId', () => {
        it('should get profile details', (done) => {
            request(app)
                .get(`/profiles/${profile.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.user.id);
                    expect(res.body.createdAt).to.be.an('string');
                    expect(res.body.updatedAt).to.be.an('string');
                    done();
                })
                .catch(done);
        });

        it('should report error NOT_FOUND, when profile does not exists', (done) => {
            request(app)
                .get('/profiles/toitexistepas')
                .set('Authorization', config.token)
                .expect(httpStatus.NOT_FOUND)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /profiles/me', () => {
        it('should get the profile of the currently authenticated user', (done) => {
            request(app)
                .get('/profiles/me')
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.user.id);
                    done();
                })
                .catch(done);
        });
    });

    describe('PUT /users/:userId', () => {
        it('should update user details', (done) => {
            request(app)
                .put(`/users/${config.user.id}`)
                .set('Authorization', config.token)
                .send({
                    email: 'sf@skatekrak.com',
                })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.user.id);
                    expect(res.body.email).to.equal('sf@skatekrak.com');
                    config.user.email = res.body.email;
                    done();
                })
                .catch(done);
        });

        it('should update user password', (done) => {
            request(app)
                .put(`/users/${config.user.id}`)
                .set('Authorization', config.token)
                .send({
                    password: 'chezcattet_maxime',
                })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.user.id);
                    done();
                })
                .catch(done);
        });

        it('should set user as admin', (done) => {
            request(app)
                .put(`/users/${config.user.id}`)
                .set('Authorization', config.tokenAdmin)
                .send({
                    role: 'admin',
                })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.role).to.equal('admin');
                    done();
                });
        });

        it('should set user as user again', (done) => {
            request(app)
                .put(`/users/${config.user.id}`)
                .set('Authorization', config.tokenAdmin)
                .send({
                    role: 'user',
                })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.role).to.equal('user');
                    done();
                });
        });
    });

    describe('POST /auth/login', () => {
        it('should login with new password', (done) => {
            request(app)
                .post('/auth/login')
                .send({
                    username: 'max_menace',
                    password: 'chezcattet_maxime',
                })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.message).to.equal('authenticated');
                    expect(res.body.token).to.be.an('string');
                    expect(res.body.user.id).to.equal(config.user.id);
                    config.token = res.body.token;
                    done();
                })
                .catch(done);
        });
    });

    describe('PUT /profiles/:profileId', () => {
        it('should update profile details', (done) => {
            request(app)
                .put(`/profiles/${profile.id}`)
                .send({
                    stance: 'regular',
                    snapchat: 'maximetrap',
                    instagram: 'maximetrap',
                    website: 'https://skatekrak.com',
                    location: 'Brisbane, Australia',
                    sponsors: ['krak', 'hermanitas', '036'],
                    description: 'Krak is love, Krak is life',
                })
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(profile.id);
                    expect(res.body.stance).to.equal('regular');
                    expect(res.body.snapchat).to.equal('maximetrap');
                    expect(res.body.instagram).to.equal('maximetrap');
                    expect(res.body.website).to.equal('https://skatekrak.com');
                    expect(res.body.location).to.equal('Brisbane, Australia');
                    expect(res.body.sponsors).to.be.an('array');
                    expect(res.body.sponsors).to.have.length(3);
                    expect(res.body.sponsors).to.contain('krak');
                    expect(res.body.sponsors).to.contain('hermanitas');
                    expect(res.body.sponsors).to.contain('036');
                    expect(res.body.description).to.equal('Krak is love, Krak is life');
                    done();
                })
                .catch(done);
        });

        it('should report error with message - "sponsors" must be an array', (done) => {
            request(app)
                .put(`/profiles/${profile.id}`)
                .send({
                    sponsors: 'helloworld',
                })
                .expect(httpStatus.BAD_REQUEST)
                .then((res) => {
                    expect(res.body.message).to.equal('"sponsors" must be an array');
                    done();
                })
                .catch(done);
        });
    });

    describe('PUT /profiles/:profileId/upload/profile', () => {
        it('should upload and update profile picture of profile', (done) => {
            request(app)
                .put(`/profiles/${profile.id}/upload/profile`)
                .attach('file', './tests/files/pic.jpg')
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.profilePicture.url).to.be.a('string');
                    expect(res.body.profilePicture.publicId).to.be.a('string');
                    done();
                })
                .catch(done);
        });
    });

    describe('PUT /profiles/:profileId/upload/banner', () => {
        it('should upload and update banner of profile', (done) => {
            request(app)
                .put(`/profiles/${profile.id}/upload/banner`)
                .attach('file', './tests/files/banner.jpg')
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.banner.url).to.be.a('string');
                    expect(res.body.banner.publicId).to.be.a('string');
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /profiles', () => {
        it('should return FORBIDDEN for getting list of profiles not as admin', (done) => {
            request(app)
                .get('/profiles')
                .set('Authorization', config.token)
                .expect(httpStatus.FORBIDDEN)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /profiles', () => {
        it('should get list of profiles', (done) => {
            request(app)
                .get('/profiles')
                .set('Authorization', config.tokenAdmin)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /profiles/search', () => {
        it('should search profiles', (done) => {
            request(app)
                .get('/profiles/search')
                .expect(httpStatus.OK)
                .query({
                    query: config.user.id,
                })
                .set('Authorization', config.token)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    done();
                })
                .catch(done);
        });
    });
});
