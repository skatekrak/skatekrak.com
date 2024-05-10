import httpStatus from 'http-status';
import request from 'supertest';
import app from '../app/server';
import config from './config';

describe('Admin Authorization', () => {
    describe('GET /dev/need-admin', () => {
        it('should return FORBIDDEN error', (done) => {
            request(app)
                .get('/dev/need-admin')
                .set('Authorization', config.token)
                .expect(httpStatus.FORBIDDEN)
                .then(() => done())
                .catch(done);
        });
    });

    describe('GET /dev/need-admin', () => {
        it('should return OK', (done) => {
            request(app)
                .get('/dev/need-admin')
                .set('Authorization', config.tokenAdmin)
                .expect(httpStatus.OK)
                .then(() => done())
                .catch(done);
        });
    });
});
