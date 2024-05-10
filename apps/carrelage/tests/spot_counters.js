import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Check Spot Stats', () => {
    it('should get correct spot statistics for spot', (done) => {
        request(app)
            .get(`/spots/${config.spot.id}`)
            .set('Authorization', config.token)
            .expect(httpStatus.OK)
            .then((res) => {
                const { body: spot } = res;
                expect(spot.mediasStat.all).to.equal(2);
                expect(spot.mediasStat.daily).to.equal(2);
                expect(spot.clipsStat.all).to.equal(1);
                expect(spot.clipsStat.daily).to.equal(1);
                expect(spot.tricksDoneStat.all).to.equal(1);
                expect(spot.tricksDoneStat.daily).to.equal(1);
                done();
            })
            .catch(done);
    });

    it('should get correct spot statistics for spot2', (done) => {
        request(app)
            .get(`/spots/${config.spot2.id}`)
            .set('Authorization', config.token)
            .expect(httpStatus.OK)
            .then((res) => {
                const { body: spot } = res;
                expect(spot.mediasStat.all).to.equal(1);
                expect(spot.mediasStat.daily).to.equal(1);
                expect(spot.clipsStat.all).to.equal(0);
                expect(spot.clipsStat.daily).to.equal(0);
                expect(spot.tricksDoneStat.all).to.equal(0);
                expect(spot.tricksDoneStat.daily).to.equal(0);
                done();
            })
            .catch(done);
    });
});
