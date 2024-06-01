import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Delete Media', () => {
    describe('DELETE /medias', () => {
        it('should delete picture media', (done) => {
            request(app)
                .delete(`/medias/${config.media.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.media.id);
                    done();
                })
                .catch(done);
        });

        it('should delete video media', (done) => {
            request(app)
                .delete(`/medias/${config.mediaVideo.id}`)
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.mediaVideo.id);
                    done();
                })
                .catch(done);
        });

        it('should delete media with trickDone', (done) => {
            request(app)
                .delete(`/medias/${config.mediaTrickDone.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.mediaTrickDone.id);
                    done();
                })
                .catch(done);
        });
    });
});
