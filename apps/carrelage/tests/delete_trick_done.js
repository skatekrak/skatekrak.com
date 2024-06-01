import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';

import app from '../app/server';
import config from './config';

describe('Delete Trick Done', () => {
    describe('DELETE /tricks-done', () => {
        it('should delete the trick done created earlier', (done) => {
            request(app)
                .delete(`/tricks-done/${config.trickDone.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then(() => {
                    done();
                })
                .catch(done);
        });

        it('should delete the switch trick done created earlier', (done) => {
            request(app)
                .delete(`/tricks-done/${config.trickDoneSwitch.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then(() => {
                    done();
                })
                .catch(done);
        });

        it('should delete the trick done on the media', (done) => {
            request(app)
                .patch(`/medias/${config.mediaTrickDone.id}`)
                .send({ trickDone: null })
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.not.have.property('trickDone');
                    done();
                })
                .catch(done);
        });
    });
});
