import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Delete Clip', () => {
    describe('DELETE /clips/:clipId', () => {
        it('should delete the clip', (done) => {
            request(app)
                .delete(`/clips/${config.clip.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.clip.id);
                    expect(res.body.className).to.equal(config.clip.className);
                    expect(res.body.addedBy.id).to.equal(config.user.id);
                    done();
                })
                .catch(done);
        });
    });
});
