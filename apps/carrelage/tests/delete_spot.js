import httpStatus from 'http-status';
import request from 'supertest';
import { expect } from 'chai';
import app from '../app/server';
import config from './config';

describe('Delete Spot', () => {
    describe('DELETE /spots/:spotId', () => {
        it('should delete spot', (done) => {
            request(app)
                .delete(`/spots/${config.spot.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.spot.id);
                    done();
                })
                .catch(done);
        });

        it('should delete second spot', (done) => {
            request(app)
                .delete(`/spots/${config.spot2.id}`)
                .set('Authorization', config.token)
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body.id).to.equal(config.spot2.id);
                    done();
                })
                .catch(done);
        });
    });
});
