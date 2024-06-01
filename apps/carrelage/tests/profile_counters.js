import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Check Profile Stats', () => {
    it('should get correct profile statistics for user', (done) => {
        request(app)
            .get(`/profiles/${config.user.id}`)
            .set('Authorization', config.token)
            .expect(httpStatus.OK)
            .then((res) => {
                const { body: profile } = res;
                expect(profile.mediasStat.all).to.equal(2);
                expect(profile.mediasStat.daily).to.equal(2);
                expect(profile.clipsStat.all).to.equal(1);
                expect(profile.clipsStat.daily).to.equal(1);
                expect(profile.tricksDoneStat.all).to.equal(1);
                expect(profile.tricksDoneStat.daily).to.equal(1);
                done();
            })
            .catch(done);
    });

    it('should get correct profile statistics for user2', (done) => {
        request(app)
            .get(`/profiles/${config.user2.id}`)
            .set('Authorization', config.token)
            .expect(httpStatus.OK)
            .then((res) => {
                const { body: profile } = res;
                expect(profile.mediasStat.all).to.equal(1);
                expect(profile.mediasStat.daily).to.equal(1);
                expect(profile.clipsStat.all).to.equal(0);
                expect(profile.clipsStat.daily).to.equal(0);
                expect(profile.tricksDoneStat.all).to.equal(0);
                expect(profile.tricksDoneStat.daily).to.equal(0);
                done();
            })
            .catch(done);
    });
});
