import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';

import app from '../app/server';
import config from './config';

describe('Create Trick Done', () => {
    describe('POST /tricks-done', () => {
        it('should create an Ollie as regular', (done) => {
            request(app)
                .post('/tricks-done')
                .set('Authorization', config.token)
                .send(config.trickDone)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.className).to.equal('trick-done');
                    expect(res.body.trick).to.equal(config.trick.id);
                    expect(res.body.points).to.equal(config.trick.points);
                    expect(res.body.addedBy).to.equal(config.user.id);
                    expect(res.body.validated).to.equal(false);
                    config.trickDone = res.body;
                    done();
                })
                .catch(done);
        });

        it('should create an Ollie as switch on a spot', (done) => {
            config.trickDoneSwitch.spot = config.spot.id;
            request(app)
                .post('/tricks-done')
                .set('Authorization', config.token)
                .send(config.trickDoneSwitch)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.className).to.equal('trick-done');
                    expect(res.body.trick).to.equal(config.trick.id);
                    expect(res.body.points).to.equal(config.trick.points);
                    expect(res.body.addedBy).to.equal(config.user.id);
                    expect(res.body.spot).to.equal(config.spot.id);
                    expect(res.body.validated).to.equal(false);
                    expect(res.body.shifty).to.equal(config.trickDoneSwitch.shifty);
                    expect(res.body.bodyVarial).to.equal(config.trickDoneSwitch.bodyVarial);
                    expect(res.body.oneFooted).to.equal(config.trickDoneSwitch.oneFooted);
                    expect(res.body.grab).to.equal(config.trickDoneSwitch.grab);
                    config.trickDoneSwitch = res.body;
                    done();
                })
                .catch(done);
        });
    });
});
