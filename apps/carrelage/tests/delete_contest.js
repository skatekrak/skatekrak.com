import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Contests API', () => {
    describe('DELETE /contests/:objectId', () => {
        it('should delete the contest', (done) => {
            request(app)
                .delete(`/contests/${config.contest.id}`)
                .set('Authorization', config.tokenAdmin)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.contest.id);
                    expect(res.body.title).to.equal(config.contest.title);
                    expect(res.body.description).to.equal(config.contest.description);
                    expect(res.body.reward).to.equal(config.contest.reward);
                    expect(res.body.logoURL).to.equal(config.contest.logoURL);
                    done();
                })
                .catch(done);
        });
    });
});
