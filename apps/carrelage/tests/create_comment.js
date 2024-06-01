import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Create Comment', () => {
    describe('POST /medias/comments', () => {
        it('should create a new comment', (done) => {
            request(app)
                .post(`/medias/${config.media.id}/comments/`)
                .send(config.comment)
                .set('Authorization', config.token2)
                .expect(httpStatus.OK)
                .then((res) => {
                    config.comment = res.body;
                    expect(res.body.content).to.equal(config.comment.content);
                    expect(res.body.addedBy).to.be.an('string');
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /notifications', () => {
        it('should get a list of notification with the previous comment', (done) => {
            request(app)
                .get('/notifications')
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    const lastNotification = res.body[0];
                    expect(lastNotification.type).to.be.equal('comment');
                    expect(lastNotification.toUser.id).to.be.equal(config.user.id);
                    done();
                })
                .catch(done);
        });
    });
});
