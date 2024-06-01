import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Delete Session', () => {
    describe('DELETE /sessions', () => {
        it('should delete session', (done) => {
            request(app)
                .delete(`/sessions/${config.session.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.session.id);
                    expect(res.body.className).to.equal('session');
                    done();
                })
                .catch(done);
        });
    });
});
