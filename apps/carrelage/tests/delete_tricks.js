import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Delete Trick API', () => {
    describe('DELETE /tricks', () => {
        it('should delete the trick', (done) => {
            request(app)
                .delete(`/tricks/${config.trick.id}`)
                .set('Authorization', config.tokenAdmin)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.className).to.equal(config.trick.className);
                    expect(res.body.id).to.equal(config.trick.id);
                    expect(res.body.name).to.equal(config.trick.name);
                    done();
                })
                .catch(done);
        });
    });
});
