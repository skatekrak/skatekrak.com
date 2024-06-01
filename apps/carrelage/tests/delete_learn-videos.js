import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Delete Learn Video API', () => {
    describe('DELETE /learn-videos/:learnVideoId', () => {
        it('should delete the learn video', (done) => {
            request(app)
                .delete(`/tricks/${config.trick.id}/learn-videos/${config.learnVideo.id}`)
                .set('Authorization', config.tokenAdmin)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.learnVideo.id);
                    expect(res.body.className).to.equal(config.learnVideo.className);
                    done();
                })
                .catch(done);
        });
    });
});
