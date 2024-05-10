import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';

describe('Misc', () => {
    describe('GET /', () => {
        it('should just respond if up', (done) => {
            request(app)
                .get('/')
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.message).to.equal('Krak Carrelage API');
                    expect(res.body.status).to.equal('Healthy');
                    done();
                })
                .catch(done);
        });
    });
});
