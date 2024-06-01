import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Create Clip', () => {
    describe('POST /clips', () => {
        it('should create a clip from a youtube video', (done) => {
            config.clip.spot = config.spot.id;
            request(app)
                .post('/clips')
                .send(config.clip)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.className).to.equal('clip');
                    expect(res.body.videoURL).to.equal(config.clip.url);
                    expect(res.body.title).to.equal('KrakBox unboxing - Best Of #4');
                    expect(res.body.addedBy).to.equal(config.user.id);
                    expect(res.body.thumbnailURL).to.equal('https://i.ytimg.com/vi/cdghhu3Yj8A/sddefault.jpg');
                    expect(res.body.provider).to.equal('youtube');
                    config.clip = res.body;
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /clips/:clipId', () => {
        it('should get the previously created clip', (done) => {
            request(app)
                .get(`/clips/${config.clip.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.className).to.equal(config.clip.className);
                    expect(res.body.videoURL).to.equal(config.clip.videoURL);
                    expect(res.body.title).to.equal(config.clip.title);
                    expect(res.body.addedBy.id).to.equal(config.user.id);
                    expect(res.body.thumbnailURL).to.equal(config.clip.thumbnailURL);
                    expect(res.body.provider).to.equal(config.clip.provider);
                    done();
                })
                .catch(done);
        });
    });

    describe('PATCH /clips/:clipId', () => {
        it('should update the clip', (done) => {
            request(app)
                .patch(`/clips/${config.clip.id}`)
                .set('Authorization', config.token)
                .send({ title: 'Best carrelage EUW' })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.title).to.equal('Best carrelage EUW');
                    expect(res.body.id).to.equal(config.clip.id);
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /clips', () => {
        it('should get a list of clips', (done) => {
            request(app)
                .get('/clips')
                .set('Authorization', config.token)
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.FORBIDDEN)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    });

    describe('GET /clips', () => {
        it('should get a list of clips', (done) => {
            request(app)
                .get('/clips')
                .set('Authorization', config.tokenAdmin)
                .query({ older: new Date().toISOString() })
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body[0].id).to.equal(config.clip.id);
                    done();
                })
                .catch(done);
        });
    });
});
