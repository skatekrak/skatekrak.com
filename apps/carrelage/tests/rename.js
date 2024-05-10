import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Rename API', () => {
    describe('POST /users/:userId/rename', () => {
        it('should rename user', (done) => {
            request(app)
                .post(`/users/${config.user.id}/rename`)
                .set('Authorization', config.token)
                .send({
                    username: 'johnson',
                })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.message).to.equal('authenticated');
                    expect(res.body.token).to.be.an('string');
                    expect(res.body.user.id).to.equal('johnson');
                    expect(res.body.user.email).to.equal(config.user.email);
                    expect(res.body.user.role).to.equal('user');
                    expect(res.body.user.createdAt).to.be.an('string');
                    expect(res.body.user.updatedAt).to.be.an('string');

                    config.token = res.body.token;
                    config.user = res.body.user;
                    done();
                })
                .catch(done);
        });
    });
});
