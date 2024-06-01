import httpStatus from 'http-status';
import request from 'supertest';
// import { expect } from "chai";
import app from '../app/server';
import config from './config';

describe('Delete Comment', () => {
    describe('DELETE /medias', () => {
        it('should delete a comment', (done) => {
            request(app)
                .delete(`/medias/${config.media.id}/comments/${config.comment.id}`)
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });
});
