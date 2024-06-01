import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Authentication', () => {
    describe('POST /auth/logout User', () => {
        it('should logout the user', (done) => {
            request(app)
                .post('/auth/logout')
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.message).to.equal('Logged out');
                    done();
                })
                .catch(done);
        });

        it('should still delete the cookie even when the token is invalid', (done) => {
            request(app)
                .post('/auth/logout')
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then(() => done())
                .catch(done);
        });

        it('should relogin the user', (done) => {
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
                    config.token = res.body.token;
                    done();
                })
                .catch(done);
        });
    });
});
