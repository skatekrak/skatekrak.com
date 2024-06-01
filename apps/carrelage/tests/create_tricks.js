import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Create Trick API', () => {
    describe('POST /tricks', () => {
        it('should create a trick', (done) => {
            request(app)
                .post('/tricks')
                .send(config.trick)
                .set('Authorization', config.tokenAdmin)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.className).to.equal('trick');
                    expect(res.body.id).to.equal(config.trick.name);
                    expect(res.body.name).to.equal(config.trick.displayName);
                    expect(res.body.difficultyLevel).to.equal(config.trick.difficultyLevel);
                    expect(res.body.order).to.equal(config.trick.order);
                    expect(res.body.hashtag).to.equal(`#${config.trick.name}`);
                    expect(res.body.keywords).to.be.an('array');
                    expect(res.body.keywords[0]).to.equal(config.trick.keywords[0]);
                    expect(res.body.keywords[1]).to.equal(config.trick.keywords[1]);
                    config.trick = res.body;
                    done();
                })
                .catch(done);
        });
    });

    describe('PUT /tricks/:trickId/upload', () => {
        it('should upload a illustration for the trick', (done) => {
            request(app)
                .put(`/tricks/${config.trick.id}/upload`)
                .attach('file', './tests/files/pic.jpg')
                .set('Authorization', config.tokenAdmin)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.className).to.equal('trick');
                    expect(res.body.id).to.equal(config.trick.id);
                    expect(res.body.name).to.equal(config.trick.name);
                    expect(res.body.difficultyLevel).to.equal(config.trick.difficultyLevel);
                    expect(res.body.order).to.equal(config.trick.order);
                    expect(res.body.hashtag).to.equal(`#${config.trick.id}`);
                    expect(res.body.keywords).to.be.an('array');
                    expect(res.body.keywords[0]).to.equal(config.trick.keywords[0]);
                    expect(res.body.keywords[1]).to.equal(config.trick.keywords[1]);
                    config.trick = res.body;
                    done();
                })
                .catch(done);
        });
    });
});
